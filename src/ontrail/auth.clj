(ns ontrail.auth
  (:use ontrail.user ontrail.crypto))

(use '[clojure.string :only (split)])

(defn authenticate [user password]
  (= (password-match? password (:password-hash (get-user user)))))

(defn auth-token [user passwordHash]
  (str (base64-encode user) ":" (base64-encode passwordHash)))

(defn valid-auth-token? [token]
  (let [[usernameBase64, passwordHashBase64] (split token #":")
        username (base64-decode usernameBase64)
        passwordHash (base64-decode passwordHashBase64)
        user (get-user username)]
      (println (format "%s %s %s %s" username passwordHash (:username user) (:passwordHash user)))
      (= passwordHash (:passwordHash user))))
