(ns ontrail.user
  (:use [ontrail.crypto]))

(defn get-user [username] 
  {:username username :passwordHash (password-hash username)})