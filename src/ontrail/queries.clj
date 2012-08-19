(ns ontrail.queries
  (:use [monger.core :only [command]]
        [monger.result :only [ok?]]
        [monger.conversion :only [from-db-object]]))

(require '[clj-time.core :as time])
(require '[monger.joda-time])

(use 'ontrail.mongodb)

(defn to-human-distance [distance]
  (let [km (int (/ distance 1000))
        m (mod distance 1000)]
    (str km "," m "km")))

(defn to-human-time [duration]
  (let [hundreds (mod duration 100)
        seconds (mod (int (/ duration 100)) 60)
        minutes (mod (int (/ duration 6000)) 60)
        hours (int (/ duration 360000))]
    (str hours "h " minutes "min")))       

(defn to-human-pace [pace]
  (let [secs (int (+ 0.5 (* 60.0 (- pace (int pace)))))]
    (str (int pace) ":" secs "min/km")))

(defn pace [db-retmap]
  (/ (/ (get db-retmap :tdur) 6000) (/ (get db-retmap :tdist) 1000)))

(defn to-summary [db-object]
  (let [db-retmap (first (get db-object :retval))
        count (int (get db-object :count))]
    {:duration (to-human-time (int (get db-retmap :dur)))
     :distance (to-human-distance (int (get db-retmap :dist)))
     :pace (to-human-pace (pace db-retmap))
     :avghr (/ (get db-retmap :tavghr) (get db-retmap :hrcount))
     :count count}))

;; Example of db.group -command in mongodb format.
;; db.exercise.group({cond: {user: "username"}, reduce: function(obj, prev) { prev.csum += obj.distance }, initial: {csum: 0 }});
(defn get-db-summary [condition]
    ;; Pace computation uses exercises, where both distance and duration are known. Those sums are recorded to tdur and tdist
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
                      prev.dur += exercise.duration }"]
    (from-db-object (command {:group {:ns "exercise"
                                      :cond condition 
                                      :$reduce js-reduce
                                      :initial {:tavghr 0
                                                :hrcount 0
                                                :dist 0
                                                :dur 0
                                                :tdist 0
                                                :tdur 0}}})
                    true)))
  
(defn get-summary [condition]
  (to-summary (get-db-summary condition)))

(defn get-year-summary [user year]
  (let [first-day (time/date-time year 1 1)
        last-day (time/date-time year 12 31)]
    (get-summary {:user user :date {:$gte first-day :$lte last-day}})))

(defn get-year-summary-sport [user year sport]
  (let [first-day (time/date-time year 1 1)
        last-day (time/date-time year 12 31)]
    (get-summary {:sport sport :user user :date {:$gte first-day :$lte last-day}})))