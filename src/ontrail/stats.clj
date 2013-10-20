(ns ontrail.stats
  (:use [ontrail mongodb formats mongerfilter])
  (:require [monger.core]
            [monger.conversion]
            [clj-time.core :as time]
            [monger.joda-time]
            [monger.collection :as mc]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))


(defn stats-avghr [db-retmap]
  (let [hrcount (:hrcount db-retmap)]
    (if (and hrcount (> hrcount 0))
      (/ (:tavghr db-retmap) hrcount)
      0)))

  (defn to-stats-summary [db-object sport]
    (let [db-retmap (first (get db-object :retval))
          count (int (get db-object :count))
          true-duration (get db-retmap :tdur)
          true-distance (get db-retmap :tdist)]
      {:duration (to-human-time (get db-retmap :dur)) :numericalDuration (get db-retmap :dur)
       :distance (to-human-distance (get db-retmap :dist)) :numDistance (if (get db-retmap :dist) (get db-retmap :dist) 0)
       :pace (get-pace {:sport sport :duration true-duration :distance true-distance})
       :avghr (int (+ 0.5 (stats-avghr db-retmap)))
       :count count}))

(defn get-stats-summary [condition]
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

(defn get-stats [query sport]
  (to-stats-summary (get-stats-summary query) sport))

(defn sport-detail [params sport user]
  (if (= "true" (params :stats))
    (let [monger-filter (make-query-from params)
        stats (get-stats monger-filter sport)]
      (.info logger (str monger-filter " " " for sport " sport " for user " user))
      {:action "other" :target sport :stats stats})
    {:action "other" :target sport}))
