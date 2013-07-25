(ns ontrail.unread
  (:use [ontrail mongodb])
  (:require [ontrail.newcomment :as nc]
            [ontrail.exercise :as ex]
            [monger.collection :as mc]
            [monger.joda-time]
            [clj-time.core :as time])
  (:import [org.bson.types ObjectId]))

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
  (ex/decorate-results user (take 100 (get-unread-objs user))))

(defn is-own? [user ex]
  (or (= user (:user ex))
      (= "admin" (:user ex))
      (contains? (set (map :user (:comments ex))) user)))

(defn comments-own [user] 
  (ex/decorate-results user (filter (partial is-own? user) (get-unread-objs user))))

(defn most-comments-oids []
  (let [four-weeks-ago (time/minus (time/now) (time/days 30))]
    (mc/aggregate "exercise" [{"$match" {:lastModifiedDate {"$gte" four-weeks-ago}}} {"$unwind" "$comments"} {"$group" {"_id" "$_id" "size" {"$sum" 1}}} {"$sort" {"size" -1}} {"$limit" 50}])))

(defn most-comments [user]
  (ex/decorate-results user (map (comp find-exercise :_id) (most-comments-oids))))

;; db.exercise.aggregate([{$match: { creationDate: {$gte: ISODate("2013-06-18T00:00:00Z")}}}, {$unwind: "$comments"}, {$group: {_id:"$_id", size: {$sum:1}}}, {$sort: {size: 1}}])
