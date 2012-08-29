(ns ontrail.user
  (:use ontrail.crypto ontrail.mongodb)
  (:require [monger.collection :as mc]))

(defn create-user [username]
  (let [profile {:resthr 42 :maxhr 192}]
    (println (str "creating user " username " with profile " profile))
    (mc/insert ONUSER {:_id username :password-hash (password-hash username) :profile profile})))

(defn get-user [username]
  (mc/find-one-as-map ONUSER {:_id username}))
