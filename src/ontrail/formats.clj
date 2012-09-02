(ns ontrail.formats)

(require '[clj-time.format :as time-format])

(defn float= [x y]
  (<= (Math/abs (- x y)) 0.00001))

(defn not-nil? [val]
  (not= val nil))

(defn positive-numbers? [vals]
  (reduce #(and %1 %2) (map #(and (not-nil? %) (> % 0)) vals)))

(defn to-human-pace [pace]
  (let [secs (int (+ 0.49 (* 60.0 (- pace (int pace)))))]
    (str (int pace) ":" (format "%02d" secs) "min/km")))

(defn get-pace [exercise]
  (let [duration (get exercise :duration)
        distance (get exercise :distance)]
    (if (positive-numbers? (list duration distance))
      (to-human-pace (/ (/ duration 6000) (/ distance 1000)))
      "")))

(defn to-human-distance [distance]
  (let [km (int (/ distance 1000))
        m (mod distance 1000)]
    (if (> km 0)
      (str km "," m "km")
      (str m "m"))))

(defn to-human-date [date-time]
  (let [date-format (time-format/formatter "dd.MM.yyyy")]
    (time-format/unparse date-format date-time)))

(defn to-human-time [duration]
  (let [hundreds (mod duration 100)
        seconds (mod (int (/ duration 100)) 60)
        minutes (mod (int (/ duration 6000)) 60)
        hours (int (/ duration 360000))]
    (str hours "h" minutes "m")))
