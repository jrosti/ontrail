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
       :count count
       :volume (if (> (:volume db-retmap) 0) (:volume db-retmap) nil)
       :repeats (if (> (:repeats db-retmap) 0) (:repeats db-retmap) nil)
       :elevation (if (> (:elevation db-retmap) 0) (:elevation db-retmap) nil)
       :paceHist (:paceHist db-retmap)
       :paceHistBins (:paceHistBins db-retmap)}))

(def hist-paces 70)
(def paces (map #(- 10 (* % 0.1)) (range hist-paces)))
(def comp-unit-paces (map #(* (/ 60 %) 1000) paces))

(defn cumul [pace-hist]
  (let [last-elem (last pace-hist)]
    (map #(/ % last-elem) pace-hist)))

(defn get-stats-summary [condition pace-histogram]
  (let [js-reduce "function(exercise, prev) {
                     if (exercise.distance > 0 && exercise.duration > 0) {
                        prev.tdist += exercise.distance;
                        prev.tdur += exercise.duration;
                      }
                      if (exercise.avghr > 0) {
                        prev.tavghr += exercise.avghr;
                        prev.hrcount += 1;
                      }
                      var i = 0;
                      if (prev.paceHistBins.length > 0) {
                          for (i = 0; i < prev.paceHistBins.length; i++) {
                              if (exercise.pace < prev.paceHistBins[i]) {
                                  prev.paceHist[i] += exercise.distance;
                              }
                          }
                      }
                      exercise.paceHist = prev.paceHist
                      exercise.paceHistBins = prev.paceHistBins
                      prev.dist += exercise.distance;
                      prev.dur += exercise.duration;
                      if (exercise.detailVolume > 0) prev.volume += exercise.detailVolume;
                      if (exercise.detailRepeats > 0) prev.repeats += exercise.detailRepeats;
                      if (exercise.detailElevation > 0) prev.elevation += exercise.detailElevation;
                   }"]
    (monger.conversion/from-db-object (monger.core/command {:group {:ns EXERCISE
                                                                    :cond condition
                                                                    :$reduce js-reduce
                                                                    :initial {:tavghr 0
                                                                              :hrcount 0
                                                                              :dist 0
                                                                              :dur 0
                                                                              :tdist 0
                                                                              :tdur 0
                                                                              :volume 0
                                                                              :repeats 0
                                                                              :elevation 0
                                                                              :paceHistBins pace-histogram
                                                                              :paceHist (take hist-paces (repeat 0))}}})
      true)))

(defn get-stats [query sport pace-histogram]
  (to-stats-summary (get-stats-summary query pace-histogram) sport))

(defn get-p-idx [indexed-cumul p]
  (first (first (filter #(> (second %) p) indexed-cumul))))

(defn pacetominkm [cpace]
  (let [kmh (/ cpace 1000.0)
        minkm (/ 60.0 kmh)
        min (int minkm)
        s (int (* 60.0 (- minkm min)))]
    (str min "." (format "%02d" s) " min/km")))

(defn get-percentiles [stats]
  (try (let [c (cumul (:paceHist stats))
             indexed-cumul (map-indexed vector c)
             f80idx (get-p-idx indexed-cumul 0.8)
             f95idx (get-p-idx indexed-cumul 0.95)
             pace80 (nth (:paceHistBins stats) f80idx)
             pace95 (nth (:paceHistBins stats) f95idx)]
      {:f80 (pacetominkm pace80)
       :f95 (pacetominkm pace95)} )
    (catch Exception e
      (.info logger (str e " in percentiles"))
      {})))

(defn sport-detail [params sport user]
  (if (= "true" (params :stats))
    (let [monger-filter (make-query-from params)
          pacehist (if (= sport "Juoksu") comp-unit-paces [])
          stats (get-stats monger-filter sport pacehist)
          percentile-vals (if (= sport "Juoksu") (get-percentiles stats) {})]
      (.info logger (str monger-filter " " " for sport " sport " for user " user))
      {:action "other" :target sport :stats (merge stats percentile-vals) })
    {:action "other" :target sport}))
