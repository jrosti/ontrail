(ns ontrail.readcount
  (:use [ontrail mongodb])
  (:require [monger.collection :as mc]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(def users-cache (ref {}))

(defn get-cc [user]
  (@users-cache user))

(defn get-or-create-cc [user]
  (dosync
   (if (contains? @users-cache user)
     (@users-cache user)
     ((alter users-cache assoc user (ref {})) user))))

(defn cc-get-new [user id]
  (let [user-cache (get-cc user)]
    (if (and (not= nil user-cache) (contains? @user-cache id))
      (:c (@user-cache id))
      0)))

(defn cc-reset [user id]
  (dosync
   (let [user-cache (get-cc user)]
     (if (and (not= nil user-cache) (contains? @user-cache id))
       (alter user-cache dissoc id)))))

(defn hit[t val] (assoc (merge-with + val {:c 1}) :ts t))

(defn cc-cache-inc [id user]
  (dosync
   (let [now (System/currentTimeMillis)
         user-cc-ref (get-or-create-cc user)]
     (if (contains? @user-cc-ref id)
       (alter user-cc-ref update-in [id] (partial hit now))
       (alter user-cc-ref assoc id {:ts now :c 1})))))

(defn zero-fun [id] 0)

(defn get-cache-fun [user]
  (if (contains? @users-cache user)
    (partial cc-get-new user)
    zero-fun))

(defn cc-comment-ex [id]
  (let [users (mc/distinct ONUSER "username" {})]
    (future (.info logger (str "Comment cache updated." (time (map (partial cc-cache-inc id) users)))))))