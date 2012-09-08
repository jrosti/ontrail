(ns ontrail.exercise
  (:use [ontrail mongodb formats log user utils]
        monger.operators)
  (:require [monger.collection :as mc]
            [clj-time.core :as time]
            [monger.query :as mq]
            [monger.joda-time]
            [net.cgrand.enlive-html :as html])
  (:import [org.bson.types ObjectId]))

(def verb-map {"Pyöräily" "pyöräili"
               "Uinti" "ui"
               "Suunnistus" "suunnisti"
               "Juoksu" "juoksi"
               "Squash" "pelasi squashia"
               "Kävely" "käveli"
               "Sulkapallo" "sulkapalloili"})

(defn get-verb [sport-id]
  (let [verb (get verb-map sport-id)]
    (if (= nil verb)
      (str "harrasti lajia " (.toLowerCase sport-id))
      verb)))

(defn get-heart-rate-reserve [exercise user-profile]
  (let [resthr (get user-profile :resthr)
        maxhr (get user-profile :maxhr)
        avghr (get exercise :avghr)]
    (if (and (not-nil? user-profile) (positive-numbers? (list resthr maxhr avghr)))
      (str (int (+ 0.5 (* 100.0 (/ (- avghr resthr) (- maxhr resthr))))) "%")
      "")))

(def TRUNCATE 100)

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
        user (get result :user)
        avatar (get-avatar-url user)
        comment-count (count (get result :comments))]
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