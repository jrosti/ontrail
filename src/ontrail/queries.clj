(ns ontrail.queries)

(require '[monger.core]
         '[monger.conversion]
         '[clj-time.core :as time]
         '[monger.joda-time]
         '[monger.collection :as mc])

(use 'ontrail.mongodb)

(defn to-human-distance [distance]
  (let [km (int (/ distance 1000))
        m (mod distance 1000)]
    (if (> km 0)
      (str km "," m "km")
      (str m "m"))))

(defn to-human-time [duration]
  (let [hundreds (mod duration 100)
        seconds (mod (int (/ duration 100)) 60)
        minutes (mod (int (/ duration 6000)) 60)
        hours (int (/ duration 360000))]
    (str hours "h" minutes "m")))

(defn to-human-pace [pace]
  (let [secs (int (+ 0.49 (* 60.0 (- pace (int pace)))))]
    (str (int pace) ":" (format "%02d" secs) "min/km")))

(defn pace [db-retmap]
  (let [distance (get db-retmap :tdist)]
    (if (> distance 0)
      (/ (/ (get db-retmap :tdur) 6000) (/ distance 1000))
      0)))

(defn avghr [db-retmap]
  (let [hrcount (get db-retmap :hrcount)]
    (if (> hrcount 0)
      (/ (get db-retmap :tavghr) hrcount)
      0)))

(defn to-summary [db-object sport]
  (let [db-retmap (first (get db-object :retval))
        count (int (get db-object :count))]
    {:duration (to-human-time (int (get db-retmap :dur)))
     :distance (to-human-distance (int (get db-retmap :dist)))
     :pace (to-human-pace (pace db-retmap))
     :avghr (avghr db-retmap)
     :count count
     :sport sport}))

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
    (monger.conversion/from-db-object (monger.core/command {:group {:ns EXERCISE
                                                                    :cond condition 
                                                                    :$reduce js-reduce
                                                                    :initial {:tavghr 0
                                                                              :hrcount 0
                                                                              :dist 0
                                                                              :dur 0
                                                                              :tdist 0
                                                                              :tdur 0}}})
                                      true)))
  
(defn get-summary [condition sport]
  (to-summary (get-db-summary condition) sport))

(defn get-year-summary [user year]
  (let [first-day (time/date-time year 1 1)
        last-day (time/date-time year 12 31)]
    (get-summary {:user user :date {:$gte first-day :$lte last-day}}) "Kaikki"))

(defn get-year-summary-sport [user year sport]
  (let [first-day (time/date-time year 1 1)
        last-day (time/date-time year 12 31)]
    (get-summary {:sport sport :user user :date {:$gte first-day :$lte last-day}} sport)))

(defn get-overall-summary [user]
  (let [all-sports (mc/distinct EXERCISE "sport" {:user user})]
    (map #(get-summary {:user user :sport %} %) all-sports)))