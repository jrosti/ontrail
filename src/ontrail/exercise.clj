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


(defn get-heart-rate-reserve [exercise user-profile]
  (let [resthr (get user-profile :resthr)
        maxhr (get user-profile :maxhr)
        avghr (get exercise :avghr)]
    (if (and (not-nil? user-profile) (positive-numbers? (list resthr maxhr avghr)))
      (str (int (+ 0.5 (* 100.0 (/ (- avghr resthr) (- maxhr resthr))))) "%")
      "")))

(def TRUNCATE 100)

(defn strip-and-truncate [s]
  (if (= s nil)
    ""
    (let [stripped (strip-html s)
          chars (count stripped)
          truncated-len (if (> chars TRUNCATE) TRUNCATE chars)]
      (if (> chars TRUNCATE)
        (str (subs stripped 0 truncated-len) "...")
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
        comment-count (count (:comments result))
        date (to-human-date (:creationDate result))]
    {:pace pace
     :title (get result :title)
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
    (log "DEBUG" "Get exercise list" rule page "with" (count results) "results.")
    (as-ex-result-list results)))

(defn get-ex [id]
  (let [exercise (mc/find-one-as-map EXERCISE {:_id (ObjectId. id)})
        user-profile (get (mc/find-one-as-map ONUSER {:username (get exercise :user)}) :profile)
        heart-rate-reserve (get-heart-rate-reserve exercise user-profile)]
    (log "DEBUG" "ex " id)
    {:title (get exercise :title)
     :body (get exercise :body)
     :duration (to-human-time (get exercise :duration))
     :creationDate (to-human-date (get exercise :creationDate))
     :avghr (get exercise :avghr)
     :hr-reserve heart-rate-reserve
     :pace (get-pace exercise)
     :comments ()}))