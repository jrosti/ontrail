(ns ontrail.auth
  (:use ontrail.user ontrail.crypto))

(use '[clojure.string :only (split)])

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn authenticate [username password]
  (let [user (get-user username)]
    (and (not (= user nil)) (= (password-match? password (:passwordHash user))))))

(defn hash-part [password-hash]
  (if password-hash
    (last (.split password-hash "\\$"))
    ""))

(defn auth-token [user]
  (clojure.string/replace (str (base64-encode (:username user)) "|" (hash-part (:passwordHash user))) #"=" "#"))

(defn user-from-token [token]
  (let [[usernameBase64, passwordHashBase64] (split (clojure.string/replace token #"#" "=") #"\|")]
    {:username (byte-array-to-string (base64-decode usernameBase64)) :passwordHash passwordHashBase64}))

(defn valid-auth-token? [token]
  (let [from-token (user-from-token token)
        user (get-user (:username from-token))]
      (if user
      (= (:passwordHash from-token) (hash-part (:passwordHash user)))
      false)))
