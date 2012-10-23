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
    (if (and (not (nil? hrcount)) (> hrcount 0))
      (/ (:tavghr db-retmap) hrcount)
      0)))

;; Fix these map acceses to be idiomatic clojure, when you see them!
(defn to-summary [db-object sport] 
  (let [db-retmap (first (get db-object :retval))
        count (int (get db-object :count))
        true-duration (get db-retmap :tdur)
        true-distance (get db-retmap :tdist)]
    {:duration (to-human-time (get db-retmap :dur))
     :distance (to-human-distance (get db-retmap :dist))
     :numericalDuration (get db-retmap :dur)
     :pace (get-pace {:sport sport :duration true-duration :distance true-distance})
     :avghr (int (+ 0.5 (avghr db-retmap)))
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

(defn get-overall-summary-cond [user condition]
  (.debug logger (str "Getting summary: " user " condition " condition))  
  (let [cond-with-user (assoc condition :user user)
        all-distinct-sports (mc/distinct EXERCISE "sport" cond-with-user)
        summary-sports (sort-by :numericalDuration > (map #(get-summary (assoc cond-with-user :sport %) %) all-distinct-sports))] 
    {:user user :sports (conj summary-sports (get-summary cond-with-user "Kaikki"))}))


(defn get-year-summary-sport [user year]
  (let [first-day (time/date-time year 1 1)
        last-day (time/date-time year 12 31)
        year-cond {:creationDate {:$gte first-day :$lte last-day}}]
    (assoc (get-overall-summary-cond user year-cond) :year year)))

(defn get-month-summary-sport [user year month]
  (let [first-day (time/date-time year month 1)
        last-day (-> first-day (.dayOfMonth) (.withMaximumValue))
        year-month-cond {:creationDate {:$gte first-day :$lte last-day}}]
    (assoc (get-overall-summary-cond user year-month-cond) :year year :month month)))

(defn get-overall-summary [user]
  (.trace logger (str "Getting overall summary: " user))
  (get-overall-summary-cond user {}))
                            
(defn get-distinct-tags [condition]
  (filter (partial not= nil) (mc/distinct EXERCISE "tags" condition)))

(defn get-overall-tags-summary [user]
  (let [tags (filter (partial not= "") (get-distinct-tags {:user user}))]
    (sort-by :numericalDuration > (map #(get-summary {:user user :tags %} %) tags))))

(defn get-distinct-sports [condition]
  (mc/distinct EXERCISE "sport" condition))

(defn get-season-months [user year]
  (let [pyear (- year 1)
        pairs [(list pyear 10) (list pyear 11) (list pyear 12) (list year 1)
               (list year 2) (list year 3) (list year 4) (list year 5) (list year 6)]]
    (map #(get-month-summary-sport user (first %) (second %)) pairs)))