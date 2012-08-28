(ns ontrail.auth
  (:use ontrail.user ontrail.crypto))

(defn authenticate [user password]
  (= (password-match password (:passwordHash (get-user user)))))

(defn auth-token [user password]
  (str (base64-encode user) ":" (base64-encode password)))

