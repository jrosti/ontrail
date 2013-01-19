(ns ontrail.newcomment
  (:use [ontrail mongodb])
  (:require [monger.collection :as mc]
            [monger.result :as mr]
            [monger.query :as mq]
            [monger.conversion]
            [clj-time.core :as time]
            ;; for date serialization to mongo.
            [monger.joda-time])
  (:import [org.bson.types ObjectId]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(def users-cache (ref {}))

(defn get-or-create-usercache [user]
  (let [users-cache-val @users-cache]
    (if (contains? users-cache-val user)
      (users-cache-val user)
      ((alter users-cache assoc user (ref {})) user))))

(defn get-user-cache [user]
  (let [user-cache-ref (@users-cache user)]
    (if (not= user-cache-ref nil)
      @user-cache-ref
      {})))
        
(defn newcount-get-new [user id]
  (let [user-cache (get-user-cache user)
        id-key (keyword id)]
    (if (contains? user-cache id-key)
      (:c (user-cache id-key))
      0)))
  
(defn newcount-reset [user id]
  (dosync
   (if-let [user-cache-ref (@users-cache user)]
      (let [user-cache @user-cache-ref
            id-key (keyword id)]
        (if (contains? user-cache id-key)
          (alter user-cache-ref dissoc id-key))))))

(defn cache-mod[f t val] (assoc (merge-with f val {:c 1}) :ts t))

(defn newcount-cache-mod [mod id user]
  (dosync
   (let [now (System/currentTimeMillis)
         user-newcount-ref (get-or-create-usercache user)
         id-key (keyword id)]
     (if (contains? @user-newcount-ref id-key)
       (alter user-newcount-ref update-in [id-key] (partial cache-mod mod now))
       (alter user-newcount-ref assoc id-key {:ts now :c 1})))))

(defn newcount-cache-inc [id user] (newcount-cache-mod + id user))

(defn zero-cache [id] 0)

(defn get-cache [user]
  (if (and (contains? @users-cache user) (not= user "nobody"))
    (partial newcount-get-new user)
    zero-cache))

(defn newcount-comment-ex [from-user id]
  (let [users (filter (partial not= from-user) (mc/distinct ONUSER "username" {}))]
    (future (.debug logger (str "Comment cache increment " id ". Distributed to: "
                                (count (map (partial newcount-cache-inc id) users)))))))

(defn newcount-uncomment-ex [id]
  (let [users (mc/distinct ONUSER "username" {})]
    (future (.debug logger (str "Comment cache reset. " id "Distributed to: "
                                (count (map #(newcount-reset % id) users)))))))

(defn visit-now [user]
  (dosync (let [user-cache-ref (get-or-create-usercache user)]
            (alter user-cache-ref assoc :lastvisit (time/now)))))

(defn get-last-visit [user]
  (let [user-cache-ref (@users-cache user)]
    (if (and user-cache-ref (:lastvisit @user-cache-ref))
      (:lastvisit @user-cache-ref)
      (time/date-time 2000 1 1))))

(defn active-users []
  (let [active-time (time/minus (time/now) (time/minutes 25))]
    (filter #(time/after? (get-last-visit %) active-time) (mc/distinct ONUSER "username"))))

(defn mark-all-read [user]
  (dosync 
    (if-let [ucache (@users-cache user)]
      (let [lastvisit (:lastvisit @ucache)]
        (alter users-cache assoc user (ref {:lastvisit lastvisit}))))))

(defn dissoc-comment-keys [comment-cache]
  (let [max-age (* 1000 60 60 24 7)
        now-millis (System/currentTimeMillis)]
    (filter identity 
      (map #(if (> (- now-millis ((comp :ts comment-cache) %)) max-age) % nil) 
        (filter (partial not= :lastvisit) (keys comment-cache))))))

(defn store-cache [user]
  (if-let [ucache (@users-cache user)]
    (do (dosync (apply alter ucache dissoc (dissoc-comment-keys @ucache)))
        (mc/update NCCACHE {:u user} {"$set" {:ref @ucache}} :upsert true))))

(defn restore-cache [user]
  (let [cache (mc/find-one-as-map NCCACHE {:u user})]
    (if (not= cache nil)
      (dosync (alter users-cache assoc user (ref (:ref cache)))))))

(defn newcomment-cache-store-all[]
  (let [res (count (filter (partial not= nil) (map store-cache (mc/distinct ONUSER "username" {}))))]
    (.trace logger (str "Comment count cache stored " res " caches "))))

(defn newcomment-cache-restore-all[]
  (.info logger (str "Restored comment count cache for users " 
    (count (map restore-cache (mc/distinct ONUSER "username" {}))))))

