(ns s3.user
  (:use [s3 crypto mongodb])
  (:require [taoensso.timbre :as timbre]
            [monger.collection :as mc]
            [monger.query :as mq]
            [monger.result :as mr]))

(timbre/refer-timbre)

(defn get-user [username]
  (mc/find-one-as-map *db* ONUSER {:username username}))

(defn get-case-user [username]
  (let [lower-user (.toLowerCase username)
        user (mc/find-one-as-map *db* ONUSER {:username username})]
    (if user
      user
      (mc/find-one-as-map *db* ONUSER {:lusername lower-user}))))
