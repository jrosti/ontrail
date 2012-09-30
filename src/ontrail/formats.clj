(ns ontrail.formats
  (:use ontrail.utils)
  (:require [clj-time.format :as time-format]
            [clj-time.core :as time]
            [clojure.string :as string]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn to-human-pace-minkm [duration distance]
  (let [pace  (/ (/ duration 6000) (/ distance 1000))
        secs (int (+ 0.49 (* 60.0 (- pace (int pace)))))]
    (str (int pace) "." (format "%02d" secs) " min/km")))

(defn to-human-pace-kmh [duration distance]
  (let [speed (/ (/ distance 1000.0) (/ duration 360000.0))
        fraction (int (* 10 (- speed (int speed))))]
    (str (int speed) "," (format "%01d" fraction) " km/h")))

(defn pace-conversion-fun [sport]
  (case sport
    "Pyöräily" to-human-pace-kmh
    to-human-pace-minkm))

(defn get-pace [exercise]
  (let [duration (get exercise :duration)
        distance (get exercise :distance)
        pace-fun (pace-conversion-fun (get exercise :sport))]
    (if (positive-numbers? (list duration distance))
      (pace-fun duration distance)
      "")))

(defn to-human-distance [distance]
  (if (= nil distance)
    ""
    (let [km (int (/ distance 1000))
          m (mod distance 1000)
          m-as-str (str "," m)]
    (if (> km 0)
      (if (= m 0)
        (str km " km")
        (str km "," (string/replace  (format "%03d" (int m)) #"0*$" "")  " km"))
      (if (> m 0)
        (str (int m) "m")
        "")))))
  
(defn to-human-date [date-time]
  (if (= nil date-time)
    ""
    (let [date-format (time-format/formatter "dd.MM.yyyy")]
      (time-format/unparse date-format date-time))))

(defn to-human-comment-date [date-time]
  (if (= nil date-time)
    ""
    (let [date-format (time-format/formatter "dd.MM.yyyy HH:mm")]
      (time-format/unparse date-format (time/plus date-time (time/hours 3)))))) ;; we're +3h from UTC

(defn seconds-part [seconds hundreds]
  (if (> hundreds 0)
    (str seconds "," (format "%02d" (int hundreds)) " s")
    (str seconds " s")))

(defn minutes-part [minutes seconds]
  (if (> seconds 0)
    (str minutes " min " seconds " s")
    (str minutes " min")))

(defn to-human-time [duration]
  (try
    (if (= nil duration)
      ""
      (let [hundreds (int (mod duration 100))
            seconds (mod (int (/ duration 100)) 60)
            minutes (mod (int (/ duration 6000)) 60)
            hours (int (/ duration 360000))]
        (if (> hours 0)
          (if (or (> minutes 0) (> seconds 0))
            (str hours " h " (minutes-part minutes seconds))
            (str hours " h"))
          (if (or (> seconds 0) (> hundreds 0))
              (str minutes " min " (seconds-part seconds hundreds))
              (str minutes " min")))))
    (catch Exception exception#
      (.error logger (str exception# duration))
      "NaN")))

  

        
        
