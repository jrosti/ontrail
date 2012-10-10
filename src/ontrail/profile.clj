(ns ontrail.profile
  (:use [ontrail mongodb user formats parser])
  (:require [monger.collection :as mc]
            [monger.result :as mr]
            [monger.query :as mq]
            [monger.conversion]
            [clj-time.core :as time]
            ;; for date serialization to mongo.
            [monger.joda-time])
  (:import [org.bson.types ObjectId]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn get-onuser [user]
  (mc/find-one-as-map ONUSER {:username user}))

(defn get-profile [user]
  (:profile (get-onuser user)))

(defn post-profile [user params]
  (.debug logger (str "Updating profile for user " user " params " params))
  (let [id (:_id (get-onuser user))]
    (mc/update-by-id ONUSER id
                     {"$set" {:profile params}}))
  (get-profile user))