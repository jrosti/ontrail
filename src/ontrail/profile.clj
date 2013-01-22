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
  (.info logger (str "Updating profile for user " user " params " params))
  (let [id (:_id (get-onuser user))
        {:keys [synopsis goals resthr maxhr aerk anaerk]} params]
    (mc/update-by-id ONUSER id
                     {"$set" {:profile {:goals goals 
                                        :synopsis synopsis
                                        :resthr (parse-natural resthr)
                                        :maxhr (parse-natural maxhr)
                                        :aerk (parse-natural aerk)
                                        :anaerk (parse-natural anaerk)}}}))
  (get-profile user))