(ns ontrail.user
  (:use [ontrail crypto mongodb utils emails])
  (:require [monger.collection :as mc]
            [monger.query :as mq]
            [monger.result :as mr]
            [postal.core :as postal]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn as-gravatar [user]
  (let [gravatar? (get user :gravatar)
        email (.toLowerCase (get user :email))
        gravatar-md5-hash (md5 email)]
    (if gravatar?
      (str "http://www.gravatar.com/avatar/" gravatar-md5-hash "?d=monsterid")
      "/img/default-avatar.png")))

(defn as-user [user]
  {:user (:username user) :profile (:profile user) :avatar (as-gravatar user)})
(defn as-user-list [results] (map as-user results))

(defn get-avatar-url [user]
  (let [onuser (mc/find-one-as-map ONUSER {:username user})]
    (if (not= nil onuser)
      (as-gravatar onuser)
      "/img/drno.png")))

(defn get-user [username]
  (mc/find-one-as-map ONUSER {:username username}))

(defn get-user-list [rule page]
  (let [results (mq/with-collection ONUSER
    (mq/find rule)
    (mq/paginate :page (Integer/valueOf page) :per-page 100)
    (mq/sort {:username 1}))]
    (.trace logger (str "Get user list " page " with " (count results) " results for " rule))
  (as-user-list results)))

(defn create-user [username password email gravatar]
  (let [profile {:resthr 42 :maxhr 192}]
    (.info logger (str "creating user " username " with profile " profile))
    (if (and (not= username "") (not= username "nobody") (= nil (get-user username)))
      (mc/insert-and-return ONUSER {:username username :passwordHash (password-hash password) :email email :profile profile :gravatar (java.lang.Boolean. gravatar)})
      (do (.error logger (str "creating user failed " username " with profile " profile))
          nil))))

(def non-user {:username "nobody" :gravatar false :email "nobody@ontrail.net"})

(defn register-user [params]
  (let [user (:username params)
        email (:email params)
        created-user (create-user user (:password params) email true)]
    (if (not= nil created-user)
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
          (if (mr/ok? (mc/update-by-id ONUSER 
                                       id {"$set" 
                                       {:passwordHash (password-hash new-password)}}))
            user
            non-user))
      non-user)))

(defn -main[& args]
  (let [[username password email has-gravatar & rest] args]
    (.info logger (str "Create user " username " email " email))
    (create-user username password email has-gravatar)))