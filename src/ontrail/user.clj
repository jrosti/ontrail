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
      (str "http://www.gravatar.com/avatar/" gravatar-md5-hash)
      "/img/default-avatar.png")))

(defn as-user [user]
  {:user (:username user) :profile (:profile user) :avatar (as-gravatar user)})
(defn as-user-list [results] (map as-user results))

(defn get-avatar-url [user]
  (let [onuser (mc/find-one-as-map ONUSER {:username user})]
    (if (not-nil? onuser)
      (as-gravatar onuser)
      "/img/drno.png")))

(defn get-user [username]
  (mc/find-one-as-map ONUSER {:username username}))

(defn get-user-list [rule page]
  (let [results (mq/with-collection ONUSER
    (mq/find rule)
    (mq/paginate :page (Integer. page) :per-page 100)
    (mq/sort {:username 1}))]
    (.trace logger (str "Get user list " page " with " (count results) " results for " rule))
  (as-user-list results)))

(defn create-user [username password email gravatar]
  (let [profile {:resthr 42 :maxhr 192}]
    (.info logger (str "creating user " username " with profile " profile))
    (if (and (not= username "") (not= username "nobody") (= nil (get-user username)))
      (mc/insert-and-return ONUSER {:username username :passwordHash (password-hash password) :email email :profile profile :gravatar (java.lang.Boolean. gravatar)})
      (.error logger (str "creating user failed " username " with profile " profile)))))

(defn register-user [params]
  (let [user (:username params)
        email (:email params)]
    (send-register-msg user email)
    (create-user user (:password params) email true)))

(defn change-password [user params]
  (let [new-password (:ch-password params)
        id (:_id (get-user user))]
    (if (and (not= nil id) (not= nil new-password))
      (do (.info logger (str "Changing password for user " user))
        {:result (mr/ok? (mc/update-by-id ONUSER 
                                          id {"$set" 
                                          {:passwordHash (password-hash new-password)}}))})
      {:result false})))

(defn -main[& args]
  (let [[username password email has-gravatar & rest] args]
    (.info logger (str "Create user " username " email " email))
    (create-user username password email has-gravatar)))