(ns ontrail.exercise
  (:use ontrail.mongodb ontrail.formats
        monger.operators)
  (:require [monger.collection :as mc]
            [clj-time.core :as time]
            [monger.query :as mq]
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

(def TRUNCATE 50)

(defn strip-and-truncate [s]
  "Does not strip tags yet"
  (let [chars (count s)
        truncated-len (if (> chars TRUNCATE) TRUNCATE chars)]
    (if (= s nil)
      ""
      (if (> chars TRUNCATE)
        (str (subs s 0 truncated-len) "...")
        s))))

(defn as-ex-result [result]
  (let [pace (get-pace {:duration (get result :duration)
                        :distance (get result :distance)
                        :sport (get result :sport)})
        duration (to-human-time (get result :duration))
        distance (to-human-distance (get result :distance))
        truncated-body (strip-and-truncate (get result :body))
        _id (get result :_id)
        sport (get result :sport)
        comment-count (count (get result :comments))]
    {:pace pace
     :duration duration
     :distance distance
     :body truncated-body
     :sport sport
     :id (str _id)
     :comment-count comment-count}))

(defn as-ex-result-list [results]
  (map as-ex-result results))

(defn get-latest-ex-list [stream-name page]
  (let [results (mq/with-collection EXERCISE
               (mq/find {})
               (mq/fields [ :_id :heading :body :duration :distance :sport :date :comments ])
               (mq/limit 30)
               (mq/sort {:date 1}))]
    (as-ex-result-list results)))

(defn get-ex [id]
  (let [exercise (mc/find-one-as-map EXERCISE {:_id (ObjectId. id)})
        user-profile (get (mc/find-one-as-map ONUSER {:username (get exercise :user)}) :profile)
        heart-rate-reserve (get-heart-rate-reserve exercise user-profile)]
    {:heading (get exercise :heading)
     :body (get exercise :body)
     :duration (to-human-time (get exercise :duration))
     :date (to-human-date (get exercise :date))
     :avghr (get exercise :avghr)
     :hr-reserve heart-rate-reserve
     :pace (get-pace exercise)
     :comments ()}))