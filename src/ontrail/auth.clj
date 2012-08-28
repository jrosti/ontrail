(ns ontrail.auth
  (:use ontrail.user ontrail.crypto))

(defn authenticate [user password]
  (= (password-match password (:passwordHash (get-user user)))))

(defn auth-token [user password]
  (str user ":" password))

