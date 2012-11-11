(ns ontrail.newcomment
  (:use [ontrail mongodb])
  (:require [monger.collection :as mc]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(def users-cache (ref {}))

(defn get-newcount [user]
  (@users-cache user))

(defn get-or-create-newcount [user]
  (dosync
   (if (contains? @users-cache user)
     (@users-cache user)
     ((alter users-cache assoc user (ref {})) user))))

(defn newcount-get-new [user id]
  (let [user-cache (get-newcount user)]
    (.info logger (str "User " user " cache " (:c (@user-cache id) )))
    (if (and (not= nil user-cache) (contains? @user-cache id))
      (:c (@user-cache id))
      0)))
  
(defn newcount-reset [user id]
  (dosync
   (let [user-cache (get-newcount user)]
     (if (and (not= nil user-cache) (contains? @user-cache id))
       (alter user-cache dissoc id)))))

(defn cache-mod[f t val] (assoc (merge-with f val {:c 1}) :ts t))

(defn newcount-cache-mod [mod id user]
  (dosync
   (let [now (System/currentTimeMillis)
         user-newcount-ref (get-or-create-newcount user)]
     (if (contains? @user-newcount-ref id)
       (alter user-newcount-ref update-in [id] (partial cache-mod mod now))
       (alter user-newcount-ref assoc id {:ts now :c 1})))))

(defn newcount-cache-inc [id user] (newcount-cache-mod + id user))

(defn zero-cache [id] 0)

(defn get-cache [user]
  (if (and (contains? @users-cache user) (not= user "nobody"))
    (partial newcount-get-new user)
    zero-cache))

(defn newcount-comment-ex [id]
  (let [users (mc/distinct ONUSER "username" {})]
    (future (.debug logger (str "Comment cache increment " id ". Distributed to: " (count (map (partial newcount-cache-inc id) users)))))))

(defn newcount-uncomment-ex [id]
  (let [users (mc/distinct ONUSER "username" {})]
    (future (.debug logger (str "Comment cache reset. " id "Distributed to: " (count (map #(newcount-reset % id) users)))))))