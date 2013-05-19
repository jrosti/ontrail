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
    {:groups (vec (map (partial decorate user) results))}))

(defn stats-query [user] 
  {:sport "Pyöräily" :user user :creationDate {"$gte" (time/date-time 2013 5 1 0 0)}})

(defn fetch-stats [group-map]
  (let [users (:users group-map)
        ranks (range 1 (inc (count users)))]
    (case (:name group-map)
      "Kilometrikisa" (map (fn [rank summary] (assoc summary :rank rank)) 
                    ranks 
                    (sort-by :numDistance > 
                      (map 
                        (fn[user] (assoc (summary/get-summary (stats-query user) :sport "Pyöräily") :user user))
                        users)))
      [])))

(defn group-detail [group-name]
  (let [group-map (find-by-name group-name)]
    {:action "group"
     :target group-name
     :description (:description group-map)
     :users (:users group-map)
     :res (fetch-stats group-map)}))

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
  {:name "1/2 maraton" :rule {:distance 21100 :user user :sport "Juoksu"}
    :filter (str "sport/Juoksu/distance/21100/user/" user "/sb/pace")}
  {:name "maraton" :rule {:distance 42195 :user user :sport "Juoksu"}
    :filter (str "sport/Juoksu/distance/42195/user/" user "/sb/pace")}
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
  (seq (filter identity (map get-record (records username)))))

(defn user-detail [username]
  (let [records (get-records username)]
    (merge {:action "user" :target username :hasRecords (not (empty? records)) :records records 
            :profile (profile/get-profile username)} (own-as-list username))))

(defn other-detail [target]
  {:action "other" :target target})
