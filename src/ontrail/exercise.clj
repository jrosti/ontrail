(ns ontrail.exercise
  (:use ontrail.mongodb ontrail.formats))

(require '[monger.conversion]
         '[clj-time.core :as time]
         '[monger.joda-time]
         '[monger.collection :as mc])

(import [org.bson.types ObjectId])

(defn get-pace [exercise]
  (let [duration (/ (get exercise :duration) 6000)
        distance (/ (get exercise :distance) 1000)]
    (if (and (> duration 0) (> distance 0))
      (to-human-pace (/ duration distance))
      "")))

(defn get-heart-rate-reserve [exercise user-profile]
  "64%")

(defn to-human-date [date]
  "0.0.0000")

(defn get-exercise [id]
  (let [exercise (mc/find-one-as-map EXERCISE {:_id (ObjectId. id)})
        user-profile (get (mc/find-one-as-map ONUSER {:_id (get exercise :user)}) :profile)
        heart-rate-reserve (get-heart-rate-reserve exercise user-profile)]
    {:heading (get exercise :heading)
     :body (get exercise :body)
     :duration (to-human-time (get exercise :duration))
     :date (to-human-date (get exercise :date))
     :avghr (get exercise :avghr)
     :hr-reserve heart-rate-reserve
     :pace (get-pace exercise)
     :comments ()}))