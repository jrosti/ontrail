(ns ontrail.auth)

(use 'ontrail.crypto)

(defn authenticate [user password]
  (= user password))

(defn auth-token [user password]
  (str user ":" password))

