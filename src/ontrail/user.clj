(ns ontrail.user
  (:use ontrail.crypto ontrail.mongodb)
  (:require [monger.collection :as mc]))

(defn create-user [username password email]
  (let [profile {:resthr 42 :maxhr 192}]
    (println (str "creating user " username " with profile " profile))
    (mc/insert ONUSER {:username username :password-hash (password-hash password) :email email :profile profile})))

(defn get-user [username]
  (mc/find-one-as-map ONUSER {:username username}))
