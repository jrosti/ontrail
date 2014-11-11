(ns s3.auth
  (:require [taoensso.timbre :as timbre])
  (:use [s3 user crypto]
        [clojure.string :only [split]]))

(timbre/refer-timbre)

(defn authenticate [username password]
  (let [user (get-case-user username)
        is-match (and (not (= user nil)) (password-match? password (:passwordHash user)))]
    is-match))

(defn hash-part [password-hash]
  (if password-hash
    (last (.split password-hash "\\$"))
    ""))

(defn auth-token [user]
  (encrypt (str (:username user) "|" (hash-part (:passwordHash user)))))

(defn user-from-token [token]
  (let [[username, passwordHash] (split (decrypt token) #"\|")]
    {:username username :passwordHash passwordHash}))

(defn valid-auth-token? [token]
  (if (not token)
    false
    (let [from-token (user-from-token token)
          user (if from-token (get-user (:username from-token)) {})]
        (and user (= (:passwordHash from-token) (hash-part (:passwordHash user)))))))

(defn user-from-cookie [cookies]
  (try
      (:username (user-from-token (:value (cookies "authToken"))))
      (catch Exception e
        (info "login failed")
        "nobody")))
    
