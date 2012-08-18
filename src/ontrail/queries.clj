(ns ontrail.queries
  (:use [monger.core :only [command]]
        [monger.result :only [ok?]]
        [monger.conversion :only [from-db-object]]))

(use 'ontrail.mongodb)

;; Pace computation uses exercises, where both distance and duration are known. Those sums are recorder to tdur and tdist
;; dist and dur are plain sums over the db values.
(def js-reduce "function(obj, prev) { if (obj.distance > 0 && obj.duration > 0) { prev.tdist += obj.distance; prev.tdur += obj.duration; } prev.dist += obj.distance; prev.dur += obj.duration }")

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

(defn pace [db-retmap]
   (str (/ (/ (get db-retmap :tdur) 6000) (/ (get db-retmap :tdist) 1000))))

(defn to-summary [db-object]
  (let [db-retmap (first (get db-object :retval))
        count (int (get db-object :count))]
    {:duration (to-human-time (int (get db-retmap :dur)))
     :distance (to-human-distance (int (get db-retmap :dist)))
     :pace (pace db-retmap)
     :count count}))
               
(defn get-db-summary [condition]
  (from-db-object (command {:group {:ns "exercise"
                                    :cond condition 
                                    :$reduce js-reduce
                                    :initial {:dist 0 :dur 0 :tdist 0 :tdur 0}}})
                  true))
  
;; Example of db.group -command
;; db.exercise.group({cond: {user: "username"}, reduce: function(obj, prev) { prev.csum += obj.distance }, initial: {csum: 0 }});
;; condition e.g. :user user
(defn get-summary [condition]
  (to-summary (get-db-summary condition)))

