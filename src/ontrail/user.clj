(ns ontrail.user
  (:use [ontrail.crypto]))

(def users (atom {}))

(defn create-user [username]
  (println (str "creating user " username))
  {:username username :passwordHash (password-hash username)})

(defn add-user [user]
  (swap! users assoc (:username user) user)
  user)

(defn get-user [username]
  (if (contains? @users username)
    (get @users username)
    (-> (create-user username)
        add-user)))
