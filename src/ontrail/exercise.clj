(ns ontrail.exercise
  (:use [ontrail mongodb formats log user utils nlp]
        monger.operators)
  (:require [monger.collection :as mc]
            [clj-time.core :as time]
            [monger.query :as mq]
            [clojure.string :as string]
            [monger.joda-time]
            [net.cgrand.enlive-html :as html])
  (:import [org.bson.types ObjectId]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn get-heart-rate-reserve [exercise user-profile]
  (let [resthr (get user-profile :resthr)
        maxhr (get user-profile :maxhr)
        avghr (get exercise :avghr)]
    (if (and (not-nil? user-profile) (positive-numbers? (list resthr maxhr avghr)))
      (str (int (+ 0.5 (* 100.0 (/ (- avghr resthr) (- maxhr resthr))))) "%")
      "")))

(def TRUNCATE 110)

(defn strip-and-truncate [s]
  (if (= s nil)
    ""
    (let [stripped (strip-html s)
          chars (count stripped)
          truncated-len (if (> chars TRUNCATE) TRUNCATE chars)]
      (if (> chars TRUNCATE)
        (str (subs stripped 0 truncated-len))
        stripped))))

(defn as-ex-result [result]
  (let [pace (get-pace {:duration (:duration result)
                        :distance (:distance result)
                        :sport (:sport result)})
        duration (to-human-time (:duration result))
        distance (to-human-distance (:distance result))
        truncated-body (strip-and-truncate (:body result))
        _id (:_id result)
        sport (:sport result)
        user (:user result)
        avatar (get-avatar-url user)
        comments (:comments result)
        comment-count (if-not (nil? comments) (count comments) 0)
        date (to-human-date (:creationDate result))]
    {:pace pace
     :title (:title result)
     :duration duration
     :distance distance
     :body truncated-body
     :did (get-verb sport)
     :sport sport
     :user user
     :avatar avatar
     :id (str _id)
     :date date
     :commentCount comment-count}))

(defn as-ex-result-list [results]
  (map as-ex-result results))

(defn get-latest-ex-list [rule page]
  (let [results (mq/with-collection EXERCISE
               (mq/find rule)
               (mq/fields [ :_id :title :user :body :duration :distance :sport :creationDate :comments ])
               (mq/paginate :page (Integer. page) :per-page 20)
               (mq/sort {:lastModifiedDate -1}))]
    (.debug logger (str "Get exercise list" rule page "with" (count results) "results."))
    (as-ex-result-list results)))

(defn get-ex [id]
  (let [exercise (mc/find-one-as-map EXERCISE {:_id (ObjectId. id)})]
    (if (nil? exercise)
      {:error "No such id"}      
      (let [user (:user exercise)
            user-profile (:profile (mc/find-one-as-map ONUSER {:username user}))
            heart-rate-reserve (get-heart-rate-reserve exercise user-profile)
            comments (:comments exercise)
            distance (to-human-distance (:distance exercise))
            comment-count (if-not (nil? comments) (count comments) 0)
            avatar (get-avatar-url user)
            date (to-human-date (:creationDate exercise))]
        (.debug logger (format " get ex=%s" id))
        {:id id
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
         :comments comments}))))