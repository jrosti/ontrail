(ns ontrail.group
  (:use monger.operators
        ontrail.mongodb
        ontrail.formats)
  (:require 
   [ontrail.favourite :as favourite]
   [monger.collection :as mc]
   [clj-time.core :as time]
   [ontrail.summary :as summary]
   [ontrail.sportsummary :as sportsummary]
   [ontrail.profile :as profile]
   [monger.result :as mr]
   [monger.query :as mq]
   [monger.conversion]
   [clj-time.core :as time]
   [monger.joda-time])
  (:import [org.bson.types ObjectId]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn in [x xs]
  (some #{x} xs))

(defn add-group [group-name description]
	(mc/insert-and-return *db* GROUPS {:name group-name :description description :users [] :lname (.toLowerCase group-name)}))

(defn find-by-name [group-name]
  (mc/find-one-as-map *db* GROUPS {:name group-name}))

(defn do-group-user-op [oper valid-oper? group-name user]
  (if (or (nil? user) (= "nobody" user) (nil? group-name))
      {:result false :descr (str "User is not allowed to join" user group-name)}
      (if-let [group (mc/find-one-as-map *db* GROUPS {:name group-name})]
        (if (valid-oper? user (:users group))
          {:result false :descr (str "User op invalid for the g:" group-name " u:" user)}
          {:result (mr/ok? (mc/update-by-id *db* GROUPS (:_id group) {oper {:users user}})) :descr (str "DB update g:" group-name " u:" user)})
        {:result false :descr "Group does not exist"})))

(defn join-to [group-name user]
  (do-group-user-op $push (fn [user users] (in user users)) group-name user))

(defn part-from [group-name user]
  (do-group-user-op $pull (fn [user users] (not= (in user users))) group-name user))

(defn decorate [user entry]
  (let [e (dissoc entry :_id)]
    (if (in user (:users e))
      (assoc e :in true)
      (assoc e :in false))))

(defn own-as-list [user]
  (let [condition (if (= user "nobody") {} {:users user})
        results (mq/with-collection *db* GROUPS
                  (mq/find condition)
                  (mq/sort {:lname 1}))]
    {:user user :groups (vec (map (fn [e] (:name e)) results))}))

(defn as-list [page user]
  (.info logger (str page "::" user))
  (let [results (mq/with-collection *db* GROUPS
                  (mq/find {})
                  (mq/paginate :page (Integer/valueOf page) :per-page 20)
                  (mq/sort {:lname 1}))]
    {:results (mapv (partial decorate user) results)}))

;; marrasputki
(def min-jog-time (* 25 60 100)) ; 25 minutes

(defn november-stats-query [users days]
  {:sport {"$in" ["Juoksu" "Maastojuoksu"]} "$or" (mapv (partial assoc {} :user) users) :duration {"$gte" min-jog-time}
   "$and" [{:creationDate {"$gte" (time/date-time 2017 11 1 0 0)}}
           {:creationDate {"$lte" (time/plus (time/date-time 2017 11 1 0 0) (time/days days))}}]
   })

(defn jogs-from-beginning-of-november [users last-day]
  (let [query (november-stats-query users last-day)]
    (mq/with-collection *db* EXERCISE
       (mq/find query) 
       (mq/fields [:creationDate :duration :user])
       (mq/sort {:creationDate 1})
       (mq/batch-size 5000))))

(defn analyze-jogs [all-results days user]
  (let [results (filter #(= user (:user %)) all-results)
        dates (set (map (comp (partial time/day) :creationDate) results))
        has-days (fn [days] (every? identity (map (partial contains? dates) days)))
        has-jogged-everyday (has-days days)
        last-missing (has-days (drop-last days))
        result-count (if has-jogged-everyday (count results) 0)]
    {:user user :isGood has-jogged-everyday :lastMissing last-missing :resultCount result-count :count (count results)}))

(defn november-race-stats-with-day [day-now users]
  (let [days (range 1 (inc day-now))
        all-results (jogs-from-beginning-of-november users day-now)]
    (mapv (partial analyze-jogs all-results days) users)))

(defn november-race-stats [users]
  (let [now (time/now)
        month-now (time/month now)
        ranks (range 1 (inc (count users)))
        day-now (cond (< month-now 11) 1
                      (= month-now 11) (time/day now)
                      (> month-now 11) 30)]
    (map (fn [rank elem] 
      (assoc elem :rank rank)) 
        ranks 
        (sort-by (juxt :resultCount :count) 
                 (fn [a b] (compare b a)) (november-race-stats-with-day day-now users)))))

;; Leuanvetohaaste 2016
(def start-date-time (time/date-time 2016 1 1 0 0))

(defn chinup-stats-query [users days] 
  {:sport "Leuanveto" "$or" (mapv (partial assoc {} :user) users)
   "$and" [{:creationDate {"$gte" (time/date-time 2016 1 1 0 0)}}
           {:creationDate {"$lte" (time/plus (time/date-time 2016 1 1 0 0) (time/days days))}}] 
   })

(defn year-day-number [date-time]
  (inc (time/in-days (time/interval start-date-time date-time))))

(defn accumulate-repeats-map [exs-list]
  (loop [accumulator {}
         i 1
         exs exs-list]
    (if (or (empty? exs) (> i 365)) 
      accumulator
      (let [current-ex (first exs)
            current-day-idx (year-day-number (:creationDate current-ex))]
        (if (> current-day-idx i) ;; check if more results for today, if not accumulate next day
          (recur accumulator (inc i) exs)
          (let [new-value (merge-with + 
                                      accumulator  
                                      {i (if-let [value (:detailRepeats current-ex)] value 0)})]
            (recur new-value i (rest exs))))))))

(defn all-chinups [users day-number]
  (let [query (chinup-stats-query users day-number)]
    (mq/with-collection *db* EXERCISE
       (mq/find query) 
       (mq/fields [:creationDate :detailRepeats :user])
       (mq/sort {:creationDate 1})
       (mq/batch-size 2000))))

(defn analyze-chinups [day-number all-results user]
  (let [results (filter #(= user (:user %)) all-results)
        reps-map (accumulate-repeats-map results)
        day-range (vec (range 1 (inc day-number)))
        total (reduce + (vals reps-map))
        ok? (every? identity (mapv (fn [day] (>= (if-let [reps (reps-map day)] reps 0) day)) day-range))]
    {:user user :ok ok? :total total :ttotal (if ok? total 0)}))

(defn challenge-results [users]
  (let [now_ (time/now)
        now (if (>= (compare now_ start-date-time) 0) now_ start-date-time)  
        day-number (year-day-number now)
        all-results (all-chinups users day-number)]
    (mapv (partial analyze-chinups day-number all-results) users)))

(defn chinup-race-stats [users]
  (let [ranks (range 1 (inc (count users)))]
    (mapv (fn [rank elem] (assoc elem :rank rank)) 
         ranks 
         (sort-by (juxt :ttotal :total) 
                  (fn [a b] (compare b a)) (challenge-results users)))))

;; elevation gain challenge
(def elevation-year 2016)
(def elevation-month 4)
(defn elevation-user [user]
  (let [result {:user user 
                :elevationNum (-> (sportsummary/get-month-summary-sport user elevation-year elevation-month)
                                  :sports
                                  last
                                  :elevation)}]
    (assoc result :elevation (to-human-distance (:elevationNum result)))))

(defn elevation-results [users]
  (let [ranks (range 1 (inc (count users)))
        results (map elevation-user users)]
    (mapv (fn [rank elem] (assoc elem :rank rank)) 
          ranks 
          (sort-by (juxt :elevationNum) 
                   (fn [a b] (compare b a)) results))))

(defn fetch-group-stats [group-map]
  (let [users (:users group-map)]
    (case (:name group-map)
      "Huippuhuhtikuu" (elevation-results users)
      "Marrasputki" (november-race-stats users)
      "lvhaaste2015" (chinup-race-stats users)
      [])))

(defn group-detail [params group-name user]
  (let [group-map (find-by-name group-name)]
    (decorate user
      {:action "group"
       :target group-name 
       :description (case group-name 
                      "Suosikit" (:fav params) 
                      (:description group-map))
       :users (case group-name 
                "Suosikit" (favourite/favourites-of (:fav params))
                (:users group-map))
       :res (fetch-group-stats group-map)})))

(defn records [user]
  [
  {:name "800 m" :rule {:distance 800 :user user :sport "Juoksu"} 
    :filter (str "sport/Juoksu/distance/800/user/" user "/sb/pace")}
  {:name "1500 m" :rule {:distance 1500 :user user :sport "Juoksu"}
    :filter (str "sport/Juoksu/distance/1500/user/" user "/sb/pace")}
  {:name "Cooper" :rule {:duration 72000 :user user :sport "Juoksu"} :tb true
    :filter (str "sport/Juoksu/duration/72000/user/" user "/sb/pace")}
  {:name "3000 m" :rule {:distance 3000 :user user :sport "Juoksu"}
    :filter (str "sport/Juoksu/distance/3000/user/" user "/sb/pace")}
  {:name "5000 m" :rule {:distance 5000 :user user :sport "Juoksu"}
    :filter (str "sport/Juoksu/distance/5000/user/" user "/sb/pace")}
  {:name "10000 m" :rule {:distance 10000 :user user :sport "Juoksu"}
    :filter (str "sport/Juoksu/distance/10000/user/" user "/sb/pace")}
  {:name "1/2 maraton" :rule {"$or" [{:distance 21100} {:distance 21090}] :user user :sport "Juoksu"}
    :filter (str "sport/Juoksu/distance/21100,21090,21098,21097/user/" user "/sb/pace")}
  {:name "maraton" :rule {"$or" [{:distance 42195} {:distance 42200}] :user user :sport "Juoksu"}
    :filter (str "sport/Juoksu/distance/42195,42200/user/" user "/sb/pace")}
  {:name "6 h" :rule {:duration 2160000 :user user :sport "Juoksu"} :tb true
    :filter (str "sport/Juoksu/duration/2160000/user/" user "/sb/pace")}
  {:name "100 km" :rule {:distance 100000 :user user :sport "Juoksu"}
    :filter (str "sport/Juoksu/distance/100000/user/" user "/sb/pace")}
  {:name "12 h" :rule {:duration 4320000 :user user :sport "Juoksu"} :tb true
    :filter (str "sport/Juoksu/duration/4320000/user/" user "/sb/pace")}
  {:name "24 h" :rule {:duration 8640000 :user user :sport "Juoksu"} :tb true
    :filter (str "sport/Juoksu/duration/8640000/user/" user "/sb/pace")}
  ])

(defn get-record [record-entry]
  (let [record (mq/with-collection *db* EXERCISE
               (mq/fields [:duration :distance :sport])
               (mq/find (:rule record-entry))
               (mq/limit 1)
               (mq/sort {:pace -1}))]
    (if (seq record)
      (let [result-fun (if (:tb record-entry) (fn [record] (to-human-distance (:distance (first record))))
                                              (fn [record] (to-human-time (:duration (first record)))))]
        {:name (:name record-entry) :result (result-fun record) :pace (get-pace (first record))
         :filter (:filter record-entry)})
      nil)))

(defn get-records [username]
  (filter identity (map get-record (records username))))

(defn user-detail [username user]
  (let [records (get-records username)]
    (merge {:action "user" :target username :hasRecords (not (empty? records)) :records records 
            :profile (profile/get-profile username)} (own-as-list username))))

