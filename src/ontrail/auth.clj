(ns ontrail.auth
  (:use ontrail.user ontrail.crypto))

(use '[clojure.string :only (split)])

(defn authenticate [user password]
  (= (password-match? password (:password-hash (get-user user)))))

(defn auth-token [user]
  (clojure.string/replace (str (base64-encode (:username user)) "|" (base64-encode (:passwordHash user))) #"=" "#"))

(defn user-from-token [token]
  (let [[usernameBase64, passwordHashBase64] (split (clojure.string/replace token #"#" "=") #"\|")]
    {:username (base64-decode usernameBase64) :passwordHash (base64-decode passwordHashBase64)}))

(defn valid-auth-token? [token]
  (let [from-token (user-from-token token)
        user (get-user (:username from-token))]
      (= (:passwordHash from-token) (:passwordHash user))))
