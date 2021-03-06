(ns ontrail.user
  (:use [ontrail crypto mongodb utils emails])
  (:require [monger.collection :as mc]
            [digest :as digest]
            [monger.query :as mq]
            [monger.result :as mr]
            [postal.core :as postal]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn as-gravatar [user]
  (let [gravatar? (:gravatar user)
        email (.toLowerCase (get user :email))
        gravatar-md5-hash (digest/md5 email)]
    (if gravatar?
      (str "http://www.gravatar.com/avatar/" gravatar-md5-hash "?d=monsterid&r=x")
      "/img/default-avatar.png")))

(defn as-user [user]
  {:user (:username user) :profile (:profile user) :avatar (as-gravatar user)})

(defn as-user-list [results] (map as-user results))

(defn get-avatar-url [user]
  (if-let [onuser (mc/find-one-as-map *db* ONUSER {:username user})]
    (as-gravatar onuser)
    "/img/drno.png"))

(defn get-user [username]
  (mc/find-one-as-map *db* ONUSER {:username username}))

(defn get-case-user [username]
  (let [lower-user (.toLowerCase username)
        user (mc/find-one-as-map *db* ONUSER {:username username})]
    (if user
      user
      (mc/find-one-as-map *db* ONUSER {:lusername lower-user}))))

(defn get-user-list [rule page]
  (let [results (mq/with-collection *db* ONUSER
                  (mq/find rule)
                  (mq/paginate :page (Integer/valueOf page) :per-page 100)
                  (mq/sort {:lusername 1}))]
    (.trace logger (str "Get user list " page " with " (count results) " results for " rule))
    (as-user-list results)))

(defn create-user [^String username password email gravatar]
  (let [profile {:resthr 42 :maxhr 192}
        lower-user (.toLowerCase username)]
    (.info logger (str "creating user " username " with profile " profile))
    (if (and (not= username "") (not= username "nobody") (= nil (get-case-user username)))
      (mc/insert-and-return *db* ONUSER {:username username :lusername lower-user :passwordHash (password-hash password) :email email :profile profile :gravatar (java.lang.Boolean. gravatar)})
      (do (.error logger (str "creating user failed " username " with profile " profile))
          nil))))

(def non-user {:username "nobody" :gravatar false :email "ontrail@ontrail.net"})

(defn register-user [params]
  (let [user (:username params)
        email (:email params)
        created-user (create-user user (:password params) email true)]
    (if created-user
      (do (send-register-msg user email) created-user)
      non-user)))

(defn verify-password [password]
  (and (not= nil password) (>= (count password) 6)))

(defn change-password [username params]
  (let [new-password (:ch-password params)
        user (get-user username)
        id (:_id user)]
    (if (and (not= nil id) (verify-password new-password))
      (do (.info logger (str "Changing password for user " username))
          (if (mr/ok? (mc/update-by-id *db* 
                                       ONUSER 
                                       id {"$set" 
                                           {:passwordHash (password-hash new-password)}}))
            user
            non-user))
      non-user)))

(defn -main[& args]
  (let [[username password email has-gravatar & rest] args]
    (.info logger (str "Create user " username " email " email))
    (create-user username password email has-gravatar)))
