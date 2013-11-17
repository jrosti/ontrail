(ns ontrail.formats
  (:use ontrail.utils)
  (:require [clj-time.format :as time-format]
            [clj-time.core :as time]
            [clojure.string :as string]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn get-hres-percentage [exercise user-profile]
  (let [resthr (get user-profile :resthr)
        maxhr (get user-profile :maxhr)
        avghr (get exercise :avghr)]
    (if (and user-profile (positive-numbers? (list resthr maxhr avghr)) (not= maxhr resthr))
      (int (+ 0.5 (* 100.0 (/ (- avghr resthr) (- maxhr resthr)))))
      0)))

(defn get-heart-rate-reserve [exercise user-profile]
  (let [res (get-hres-percentage exercise user-profile)]
    (if (> res 0) 
      (str res "%")
      "")))

(defn to-human-pace-minkm [duration distance]
  (let [pace  (/ (/ duration 6000) (/ distance 1000))
        secs (int (* 60.0 (- pace (int pace))))]
    (str (int pace) "." (format "%02d" secs) " min/km")))

(defn to-human-pace-500m [duration distance]
  (let [pace  (/ (/ duration 6000) (/ distance 500))
        secs (int (* 60.0 (- pace (int pace))))]
    (str (int pace) "." (format "%02d" secs) " min/500m")))

(defn to-human-pace-kmh [duration distance]
  (let [speed (/ (/ distance 1000.0) (/ duration 360000.0))
        fraction (int (* 10 (- (+ 0.05 speed) (int speed))))]
    (str (int speed) "," (format "%01d" fraction) " km/h")))

(defn pace-conversion-fun [^String sport]
  (case sport
    "Pyöräily" to-human-pace-kmh
    "tmp" to-human-pace-kmh
    "Sisäsoutu" to-human-pace-500m
    "Rullaluistelu" to-human-pace-kmh
    "Kickbike" to-human-pace-kmh
    "CYCLO" to-human-pace-kmh
    "MAANTIE" to-human-pace-kmh
    "TYÖMATKAPYÖRÄILY" to-human-pace-kmh
    "MTB" to-human-pace-kmh
    to-human-pace-minkm))

(defn get-pace [exercise]
  (let [duration (get exercise :duration)
        distance (get exercise :distance)
        pace-fun (pace-conversion-fun (get exercise :sport))]
    (if (positive-numbers? (list duration distance))
      (pace-fun duration distance)
      "")))

(defn get-bpmdist [exercise profile]
  (let [{:keys [duration distance avghr]} exercise
        {:keys [resthr]} profile]
    (if (positive-numbers? (list resthr duration distance avghr))
        (string/replace (format "%.2f m/b" (/ distance (* (- avghr resthr) duration (double (/ 1 6000))))) #"\." ","))))

(defn to-human-distance [distance]
  (if (= nil distance)
    ""
    (let [km (int (/ distance 1000))
          m (int (mod distance 1000))]
    (if (> km 0)
      (if (= m 0)
        (str km " km")
        (str km "," (string/replace (format "%03d" m) #"0+$" "") " km"))
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
    (let [date-format (time-format/formatter "dd.MM.yyyy")]
      (str (time-format/unparse date-format date-time)
           " "
           (format "%02d:%02d" (time/hour date-time) (time/minute date-time))))))

(defn to-simple-date [date-time]
  (if (= nil date-time)
    ""
    (let [date-format (time-format/formatter "dd-MM-yyyy_hhmm")]
      (time-format/unparse date-format date-time))))

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


        
        
