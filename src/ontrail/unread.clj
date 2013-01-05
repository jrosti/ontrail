(ns ontrail.unread
  (:use [ontrail mongodb])
  (:require [ontrail.newcomment :as nc]
            [ontrail.exercise :as ex]
            [monger.collection :as mc]
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
  (ex/decorate-results user (get-unread-objs user)))

(defn comments-own [user] 
  (ex/decorate-results user (filter #(= (:user %) user) (get-unread-objs user))))
