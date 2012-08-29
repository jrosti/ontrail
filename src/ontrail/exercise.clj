(ns ontrail.exercise)

(require '[monger.conversion]
         '[clj-time.core :as time]
         '[monger.joda-time]
         '[monger.collection :as mc])

(import [org.bson.types ObjectId])

(use 'ontrail.mongodb)
(use 'ontrail.formats)

(defn get-pace [exercise]
  (let [duration (/ (get exercise :duration) 6000)
        distance (/ (get exercise :distance) 1000)]
    (if (and (> duration 0) (> distance 0))
      (to-human-pace (/ duration distance))
      "")))
        

(defn get-exercise [id]
  (let [exercise (mc/find-one-as-map EXERCISE {:_id (ObjectId. id)})
        user-profile (mc/find-one-as-map ONUSER {:_id (get exercise :user)})
        heart-rate-reserve exercise user-profile]
    {:heading (get exercise :heading)
     :body (get exercise :body)
     :duration (to-human-time (get exercise :duration))
     :date (to-human-date (get exercise :date))
     :avghr (get exercise :avghr)
     :hr-reserve heart-rate-reserve
     :pace (get-pace exercise)
     :comments ()}))