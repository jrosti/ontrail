(ns ontrail.group
  (:use monger.operators
        ontrail.mongodb
        ontrail.formats)
  (:require [monger.collection :as mc]
            [clj-time.core :as time]
            [ontrail.summary :as summary]
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
	(mc/insert-and-return GROUPS {:name group-name :description description :users [] :lname (.toLowerCase group-name)}))

(defn find-by-name [group-name]
  (mc/find-one-as-map GROUPS {:name group-name}))

(defn do-group-user-op [oper valid-oper? group-name user]
  (if (or (nil? user) (= "nobody" user) (nil? group-name))
      {:result false :descr (str "User is not allowed to join" user group-name)}
      (if-let [group (mc/find-one-as-map GROUPS {:name group-name})]
        (if (valid-oper? user (:users group))
          {:result false :descr (str "User op invalid for the g:" group-name " u:" user)}
          {:result (mr/ok? (mc/update-by-id GROUPS (:_id group) {oper {:users user}})) :descr (str "DB update g:" group-name " u:" user)})
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
        results (mq/with-collection GROUPS
                  (mq/find condition)
                  (mq/sort {:lname 1}))]
    {:groups (vec (map (fn [e] (:name e)) results))}))

(defn as-list [page user]
  (.info logger (str page "::" user))
  (let [results (mq/with-collection GROUPS
                  (mq/find {})
                  (mq/paginate :page (Integer/valueOf page) :per-page 20)
                  (mq/sort {:lname 1}))]
    {:results (mapv (partial decorate user) results)}))

;; marrasputki
(def min-jog-time (* 25 60 100)) ; 25 minutes

(defn november-stats-query [users] 
  {:sport "Juoksu" "$or" (mapv (partial assoc {} :user) users) :duration {"$gte" min-jog-time} 
   "$and" [{:creationDate {"$gte" (time/date-time 2012 11 1 0 0)}}
           {:creationDate {"$lte" (time/date-time 2012 12 1 0 0)}}] 
   })

(defn jogs-from-beginning-of-november [users]
  (let [query (november-stats-query users)]
    (mq/with-collection EXERCISE
       (mq/find query) 
       (mq/fields [:creationDate :duration :user])
       (mq/sort {:creationDate 1}))))

(defn analyze-jogs [all-results days user]
  (let [results (filter #(= user (:user %)) all-results)
        dates (set (map (comp (partial time/day) :creationDate) results))
        has-all (every? identity (map (partial contains? dates) days))
        jog-count (count dates)]
    {:user user :isGood has-all :jogCount jog-count}))

(defn november-race-stats-with-day [day-now users]
  (let [days (range 1 (inc day-now))
        all-results (jogs-from-beginning-of-november users)]
    (mapv (partial analyze-jogs all-results days) users)))

(def november-race-stats 
  (partial november-race-stats (time/day (time/now))))

(defn fetch-stats [group-map]
  (let [users (:users group-map)]
    (case (:name group-map)
      "Marrasputki" (november-race-stats users)
      [])))

(defn group-detail [group-name user]
  (let [group-map (find-by-name group-name)]
    (decorate user
      {:action "group"
       :target group-name
       :description (:description group-map)
      :users (:users group-map)
      :res (fetch-stats group-map)})))

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
  (let [record (mq/with-collection EXERCISE
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

