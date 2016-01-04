(ns ontrail.summary
  (:use [ontrail mongodb formats])
  (:require [monger.core]
            [monger.conversion]
            [clj-time.core :as time]
            [monger.joda-time]
            [monger.collection :as mc]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn avghr [db-retmap]
  (let [hrcount (:hrcount db-retmap)]
    (if (and hrcount (> hrcount 0))
      (int (+ 0.5 (/ (:tavghr db-retmap) hrcount)))
      "")))

(defn to-summary [db-object key sport] 
  (let [db-retmap (first (get db-object :retval))
        count (int (get db-object :count))
        true-duration (get db-retmap :tdur)
        true-distance (get db-retmap :tdist)]
    {:duration (to-human-time (get db-retmap :dur))
     :nduration (get db-retmap :dur)
     :distance (to-human-distance (get db-retmap :dist))
     :ndistance (if (get db-retmap :dist) (get db-retmap :dist) 0)
     :pace (get-pace {:sport sport :duration true-duration :distance true-distance})
     :tduration true-duration
     :tdistance true-distance
     :avghr (avghr db-retmap)
     :repeats (if-let [reps (:repeats db-retmap)] (when (> reps 0) reps))
     :elevation (if-let [elevation (:elevation db-retmap)] (when (> elevation 0)
     elevation))
     :count count
     key sport}))

;; Example of db.group -command in mongodb format.
;; db.exercise.group({cond: {user: "username"}, 
;; reduce: function(obj, prev) { prev.csum += obj.distance }, initial: {csum: 0 }});
(defn get-db-summary [condition]
  ;; Pace computation uses exercises, where both distance and duration are known. 
  ;; Those sums are recorded to tdur and tdist
  ;; while reducing, and dist and dur are plain sums over the db values.
  (let [js-reduce "function(exercise, prev) {
                     if (exercise.distance > 0 && exercise.duration > 0) {
                        prev.tdist += exercise.distance;
                        prev.tdur += exercise.duration;
                      }
                      if (exercise.avghr > 0) {
                        prev.tavghr += exercise.avghr;
                        prev.hrcount += 1;  
                      }
                      prev.dist += exercise.distance;
                      prev.dur += exercise.duration;
                      if (exercise.detailRepeats > 0) prev.repeats += exercise.detailRepeats;
                      if (exercise.detailElevation > 0) prev.elevation += exercise.detailElevation;}"]
    (monger.conversion/from-db-object (monger.core/command *db* {:group {:ns EXERCISE
                                                                         :cond condition 
                                                                         :$reduce js-reduce
                                                                         :initial {:tavghr 0
                                                                                   :hrcount 0
                                                                                   :dist 0
                                                                                   :dur 0
                                                                                   :tdist 0
                                                                                   :tdur 0
                                                                                   :repeats 0
                                                                                   :elevation 0}}})
                                      true)))
  
(defn get-summary [condition key sport]
  (to-summary (get-db-summary condition) key sport))

(defn get-season-months [summary-fun user prev-year]
  (let [pyear (- prev-year 1)
        year prev-year
        pairs (reverse (for [month (range 1 13)] (list year month)))]
    (map #(summary-fun user (first %) (second %)) pairs)))
