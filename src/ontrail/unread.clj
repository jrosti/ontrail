(ns ontrail.unread
  (:use [ontrail mongodb])
  (:require [ontrail.newcomment :as nc]
            [clojure.core.memoize :as memo]
            [ontrail.exercise :as ex]
            [monger.collection :as mc]
            [monger.joda-time]
            [clj-time.core :as time])
  (:import [org.bson.types ObjectId]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn object-id [^String s] 
  (ObjectId. s))

(defn find-exercise [oid]
  (mc/find-one-as-map EXERCISE {:_id oid}))

(defn get-oids [user]
  (let [id-keys (filter (partial not= :lastvisit) (keys (nc/get-user-cache user)))]
    (map (comp object-id name) id-keys)))

(defn get-unread-objs [user]
  (sort-by :lastModifiedDate time/after? (filter identity (map find-exercise (get-oids user)))))

(defn comments-all [user]
  (ex/decorate-results user (take 20 (get-unread-objs user))))

(defn is-own? [user ex]
  (or (= user (:user ex))
      (= "admin" (:user ex))
      (contains? (set (map :user (:comments ex))) user)))

(defn comments-own [user] 
  (ex/decorate-results user (filter (partial is-own? user) (get-unread-objs user))))

(defn count-comments [ex] 
  (:newComments ex))

(defn count-all [user]
  (let [uc (nc/get-user-cache user)]
    (reduce 
     + 0 
     (filter identity (map (fn [e] (-> e second :c)) uc)))))

(defn count-new [type user]
  (condp = type
    :all {:count (count-all user)}
    :own {:count (reduce + (map count-comments (comments-own user)))}))

(defn most-comments-oids []
  (.info logger "Aggregating comment counts")
  (let [comments-from (time/minus (time/now) (time/days 14))]
    (mc/aggregate "exercise" [{"$match" {:creationDate {"$gte" comments-from}}} {"$unwind" "$comments"} {"$group" {"_id" "$_id" "size" {"$sum" 1}}} {"$sort" {"size" -1}} {"$limit" 100}])))

(defn most-comments [user]
  (ex/decorate-results user (map (comp find-exercise :_id) (most-comments-oids))))

;; Aggregate command for the 
;; db.exercise.aggregate([{$match: { creationDate: {$gte: ISODate("2013-06-18T00:00:00Z")}}}, {$unwind: "$comments"}, {$group: {_id:"$_id", size: {$sum:1}}}, {$sort: {size: 1}}])
