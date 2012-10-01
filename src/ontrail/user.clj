(ns ontrail.user
  (:use [ontrail crypto mongodb utils])
  (:require [monger.collection :as mc]
            [monger.query :as mq]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn get-avatar-url [user]
  (let [onuser (mc/find-one-as-map ONUSER {:username user})]
    (if (not-nil? onuser)
      (let [gravatar? (get onuser :gravatar)
            email (get onuser :email)
            gravatar-md5-hash (md5 email)]
        (if gravatar?
          (str "http://www.gravatar.com/avatar/" gravatar-md5-hash)
          "/img/default-avatar.png"))
      "/img/drno.png")))

(defn create-user [username password email gravatar]
  (let [profile {:resthr 42 :maxhr 192}]
    (.info logger (str "creating user " username " with profile " profile))
    (mc/insert ONUSER {:username username :passwordHash (password-hash password) :email email :profile profile :gravatar (java.lang.Boolean. gravatar)})))

(defn get-user [username]
  (mc/find-one-as-map ONUSER {:username username}))

(defn get-user-list [page]
  (let [results (mq/with-collection ONUSER
    (mq/find)
    (mq/paginate :page (Integer. page) :per-page 20)
    (mq/sort {:username -1}))]
    (.debug logger (str "Get user list " page " with " (count results) " results."))
  results))

(defn -main[& args]
  (let [[username password email has-gravatar & rest] args]
    (.info logger (str "Create user " username " email " email))
    (create-user username password email has-gravatar)))