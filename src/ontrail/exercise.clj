(ns ontrail.exercise
  (:use [ontrail mongodb formats user utils nlp]
        monger.operators)
  (:require [ontrail.newcomment :as nc]
            [monger.collection :as mc]
            [clj-time.core :as time]
            [monger.query :as mq]
            [clojure.string :as string]
            [monger.joda-time]
            [net.cgrand.enlive-html :as html])
  (:import [org.bson.types ObjectId])
  (:import [org.joda.time DateTime]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn as-comment [comment]
  (let [id (str (:_id comment))]
    (merge (dissoc comment :_id) {:id id})))

(defn is-new [ex last-visit]
  (let [lmd (:lastModifiedDate ex)]
    (if (and (not= nil lmd) (not= nil last-visit))
      (time/after? (:lastModifiedDate ex) (time/minus last-visit (time/minutes 1)))
      false)))

(defn as-ex-result
  ([exercise] (as-ex-result (time/now) nc/zero-cache exercise))
  ([last-visit newcomment-cache exercise]
     (let [id (str (:_id exercise))
           user (:user exercise)
           user-profile (:profile (mc/find-one-as-map ONUSER {:username user}))
           heart-rate-reserve (get-heart-rate-reserve exercise user-profile)
           comments (map as-comment (:comments exercise))
           distance (to-human-distance (:distance exercise))
           comment-count (if-not (nil? comments) (count comments) 0)
           avatar (get-avatar-url user)
           date (to-human-date (:creationDate exercise))
           bpmdist (get-bpmdist exercise user-profile)
           new-comments (newcomment-cache id)
           bare-ex {:id id
                    :user user
                    :isNew (is-new exercise last-visit)
                    :userProfile  user-profile
                    :distance distance
                    :title (:title exercise)
                    :body (:body exercise)
                    :tags (:tags exercise)
                    :did (get-verb (:sport exercise))
                    :sport (:sport exercise)
                    :avatar avatar
                    :date date
                    :duration (to-human-time (:duration exercise))
                    :creationDate (to-human-date (:creationDate exercise))
                    :avghr (:avghr exercise)
                    :hrReserve heart-rate-reserve
                    :pace (get-pace exercise)
                    :commentCount comment-count
                    :comments comments
                    :lastModifiedDate (:lastModifiedDate exercise)
                    :bpmdist bpmdist
                    :synopsis (:synopsis user-profile)}]
       (if (> new-comments 0)
         (assoc bare-ex :newComments new-comments)
         bare-ex))))
  
(defn as-ex-result-list
  ([results]
     (as-ex-result-list (time/now) nc/zero-cache results))
  ([last-visit new-comment-cache results]
     (map (partial as-ex-result last-visit new-comment-cache) results)))

(defn decorate-results [viewing-user results]
  (let [last-visit (if (not= viewing-user "nobody")
                      (nc/get-last-visit viewing-user)
                      (time/now))]
    (as-ex-result-list last-visit (nc/get-cache viewing-user) results)))

(defn get-latest-ex-list
  ([rule page sort-rule]
     (get-latest-ex-list "nobody" rule page sort-rule))
  ([viewing-user rule page sort-rule]
    (let [results (mq/with-collection EXERCISE
                     (mq/find rule)
                     (mq/paginate :page (Integer. page) :per-page 20)
                     (mq/sort sort-rule))
          decorated-results (decorate-results viewing-user results)]
      (nc/visit-now viewing-user)
      (.info logger (str "Ex-list " rule " for " viewing-user " at page " page))
      decorated-results)))

(defn get-latest-ex-list-default-order
  ([rule page]
     (get-latest-ex-list "nobody" rule page))
  ([viewing-user rule page]
     (get-latest-ex-list viewing-user rule page {:lastModifiedDate -1})))

(defn get-ex
  ([viewing-user id]
     (.info logger (str "User " viewing-user " getting ex with id " id))
     (nc/newcount-reset viewing-user id)
     (get-ex id))
  ([id]
     (let [exercise (mc/find-one-as-map EXERCISE {:_id (ObjectId. id)})]
       (.trace logger (format " get ex=%s" id))
       (if (nil? exercise)
         {:error "No such id"}
         (as-ex-result exercise)))))
