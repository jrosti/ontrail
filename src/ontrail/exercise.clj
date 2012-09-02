(ns ontrail.exercise
  (:use ontrail.mongodb ontrail.formats))

(require '[monger.conversion]
         '[clj-time.core :as time]
         '[monger.joda-time]
         '[monger.collection :as mc])

(import [org.bson.types ObjectId])

(defn get-heart-rate-reserve [exercise user-profile]
  (let [resthr (get user-profile :resthr)
        maxhr (get user-profile :maxhr)
        avghr (get exercise :avghr)]
    (println (format "hr res: %d %d %d" resthr maxhr avghr))
    (if (and (not-nil? user-profile) (positive-numbers? (list resthr maxhr avghr)))
      (str (int (+ 0.5 (* 100.0 (/ (- avghr resthr) (- maxhr resthr))))) "%")
      "")))
 
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