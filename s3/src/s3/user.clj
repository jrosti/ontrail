(ns s3.user
  (:use [s3 crypto mongodb])
  (:require [taoensso.timbre :as timbre]
            [monger.collection :as mc]
            [monger.query :as mq]
            [monger.result :as mr]
            [digest :as digest]))

(timbre/refer-timbre)

(defn as-gravatar [user]
  (let [gravatar? (:gravatar user)
        email (.toLowerCase (get user :email))
        gravatar-md5-hash (digest/md5 email)]
    (if gravatar?
      (str "http://www.gravatar.com/avatar/" gravatar-md5-hash "?d=monsterid&r=x")
      "/img/default-avatar.png")))

(defn as-user [user]
  {:user (:username user) :profile (:profile user) :avatar (as-gravatar user)})

(defn as-user-list [results] (map as-user results))

(defn get-avatar-url [user]
  (if-let [onuser (mc/find-one-as-map *db* ONUSER {:username user})]
    (as-gravatar onuser)
    "/img/favicon-144x144.png"))

(defn get-user [username]
  (mc/find-one-as-map *db* ONUSER {:username username}))

(defn get-case-user [username]
  (let [lower-user (.toLowerCase username)
        user (mc/find-one-as-map *db* ONUSER {:username username})]
    (if user
      user
      (mc/find-one-as-map *db* ONUSER {:lusername lower-user}))))
