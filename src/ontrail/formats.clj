(ns ontrail.formats
  (:require [clj-time.format :as time-format]
            [clojure.string :as string]))

(defn float= [x y]
  (<= (Math/abs (- x y)) 0.00001))

(defn not-nil? [val]
  (not= val nil))

(defn positive-numbers? [vals]
  (reduce #(and %1 %2) (map #(and (not-nil? %) (> % 0)) vals)))

(defn to-human-pace-minkm [duration distance]
  (let [pace  (/ (/ duration 6000) (/ distance 1000))
        secs (int (+ 0.49 (* 60.0 (- pace (int pace)))))]
    (str (int pace) "." (format "%02d" secs) " min/km")))

(defn to-human-pace-kmh [duration distance]
  (let [speed (/ (/ distance 1000.0) (/ duration 360000.0))
        fraction (int (* 10 (- speed (int speed))))]
    (str (int speed) "," (format "%01d" fraction) " km/t")))

(defn pace-conversion-fun [sport]
  (case sport
    "Pyöräily" to-human-pace-kmh
    to-human-pace-minkm))

(defn get-pace [exercise]
  (let [duration (get exercise :duration)
        distance (get exercise :distance)
        pace-fun (pace-conversion-fun (get exercise :sport))]
    (if (positive-numbers? (list duration distance))
      (pace-fun duration distance))))

(defn to-human-distance [distance]
  (let [km (int (/ distance 1000))
        m (mod distance 1000)
        m-as-str (str "," m)]
    (if (> km 0)
      (if (= m 0)
        (str km " km")
        (str km "," (string/replace  (format "%03d" (int m)) #"0*$" "")  " km"))
      (if (> m 0)
        (str (int m) "m")
        ""))))

(defn to-human-date [date-time]
  (let [date-format (time-format/formatter "dd.MM.yyyy")]
    (time-format/unparse date-format date-time)))

(defn to-human-time [duration]
  (let [hundreds (mod duration 100)
        seconds (mod (int (/ duration 100)) 60)
        minutes (mod (int (/ duration 6000)) 60)
        hours (int (/ duration 360000))]
    (if (> hours 0)
      (str hours " t " minutes " min")
      (if (> seconds 0)
        (str minutes " min " seconds " s")
        (str minutes " min")))))

(defn to-human-stats-time [duration]
  "Finnish time formatting"
  (let [hundreds (mod duration 100)
        seconds (mod (int (/ duration 100)) 60)
        minutes (mod (int (/ duration 6000)) 60)
        hours (int (/ duration 360000))]
    (if (and (> hundreds 0))
      (if (< minutes 1)
        (format "%d,%02d" seconds hundreds)
        (format "%d.%d,%d" minutes seconds hundreds))
      (if (> hours 0)
        (format "%d.%d.%d" hours minutes seconds)
        (format "%d.%d" minutes seconds)))))
        
        
