(ns ontrail.exercise
  (:use [ontrail mongodb formats user utils nlp readcount]
        monger.operators)
  (:require [monger.collection :as mc]
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

(defn as-ex-result [new-comment-cache-fun exercise]
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
        new-comments (new-comment-cache-fun id)
        bare-ex {:id id
                 :user user
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
                 :bpmdist bpmdist}]
    (if (> new-comments 0)
      (assoc bare-ex :newComments new-comments)
      bare-ex)))

(defn as-ex-result-list [new-comment-cache-fun results]
  (map (partial as-ex-result new-comment-cache-fun) results))

(defn get-latest-ex-list-with-sort-rule [new-comment-cache-fun rule page sort-rule]
  (let [results (mq/with-collection EXERCISE
                  (mq/find rule)
                  (mq/paginate :page (Integer. page) :per-page 20)
                  (mq/sort sort-rule))]
    (.debug logger (str "Get exercise list " rule " " page " with " (count results) " results."))
    (as-ex-result-list new-comment-cache-fun results)))

(defn get-latest-ex-list [new-comment-cache-fun rule page]
  (get-latest-ex-list-with-sort-rule new-comment-cache-fun rule page {:lastModifiedDate -1}))

(defn get-ex [id]
  (let [exercise (mc/find-one-as-map EXERCISE {:_id (ObjectId. id)})]
    (.debug logger (format " get ex=%s" id))
    (if (nil? exercise)
      {:error "No such id"}
      (as-ex-result zero-fun exercise))))

(defn get-and-reset-cache-ex [viewing-user id]
  (cc-reset viewing-user id)
  (get-ex id))
  
(defn get-newer-ex-than [str-date]
  (let [date (DateTime. str-date)
        results (mq/with-collection EXERCISE
                  (mq/find {:lastModifiedDate {:$gte date}})
                  (mq/sort {:lastModifiedDate -1}))]
    (.debug logger (str "Get exercise list newer than " str-date " with " (count results) " results."))
    (as-ex-result-list zero-fun results)))
    