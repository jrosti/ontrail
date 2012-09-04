(ns ontrail.summary
  (:use ontrail.mongodb ontrail.formats)
  (:require [monger.core]
            [monger.conversion]
            [clj-time.core :as time]
            [monger.joda-time]
            [monger.collection :as mc]))

(defn avghr [db-retmap]
  (let [hrcount (get db-retmap :hrcount)]
    (if (> hrcount 0)
      (/ (get db-retmap :tavghr) hrcount)
      0)))

(defn to-summary [db-object sport]
  (let [db-retmap (first (get db-object :retval))
        count (int (get db-object :count))
        true-duration (get db-retmap :tdur)
        true-distance (get db-retmap :tdist)]
    {:duration (to-human-time (get db-retmap :dur))
     :distance (to-human-distance (get db-retmap :dist))
     :numericalDuration (get db-retmap :dur)
     :pace (get-pace {:sport sport :duration true-duration :distance true-distance})
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
    (get-summary {:user user :creationDate {:$gte first-day :$lte last-day}}) "Kaikki"))

(defn get-year-summary-sport [user year sport]
  (let [first-day (time/date-time year 1 1)
        last-day (time/date-time year 12 31)]
    (get-summary {:sport sport :user user :creationDate {:$gte first-day :$lte last-day}} sport)))

(defn get-overall-summary [user]
  (println (str "Getting overall summary: " user))
  (let [all-sports (mc/distinct EXERCISE "sport" {:user user})]
    (sort-by :numericalDuration > (map #(get-summary {:user user :sport %} %) all-sports))))