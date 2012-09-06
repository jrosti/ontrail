(ns ontrail.user
  (:use ontrail.crypto ontrail.mongodb)
  (:require [monger.collection :as mc]))

(defn get-avatar-url [user]
  (let [onuser (mc/find-one-as-map ONUSER {:username user})
        gravatar? (get onuser :gravatar)
        email (get onuser :email)
        gravatar-md5-hash (md5 email)]
    (if gravatar?
      (str "http://www.gravatar.com/avatar/" gravatar-md5-hash ".jpg")
      "/img/default-avatar.png")))

(defn create-user [username password email gravatar]
  (let [profile {:resthr 42 :maxhr 192}]
    (println (str "creating user " username " with profile " profile))
    (mc/insert ONUSER {:username username :passwordHash (password-hash password) :email email :profile profile :gravatar (java.lang.Boolean. gravatar)})))

(defn get-user [username]
  (mc/find-one-as-map ONUSER {:username username}))
