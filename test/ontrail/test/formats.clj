(ns ontrail.test.formats
  (:use [ontrail.formats])
  (:use [clojure.test]))

(require '[clj-time.core :as time])

(deftest test-to-human-pace-minkm
  (is (= "6.00 min/km" (to-human-pace-minkm (* 100 60 6) 1000)) "Basic pace test."))

(deftest test-to-human-distance
  (is (= "1 km" (to-human-distance 1000)) "one kilometer"))

(deftest test-to-human-distance-1100
  (is (= "1,1 km" (to-human-distance 1100)) "fractions"))

(deftest test-to-human-normal
  (is (= "45 min" (to-human-time (* 45 100 60))) "This format is incorporated to sentences."))

(deftest test-to-human-distance-1001
  (is (= "1,001 km" (to-human-distance 1001)) "meters"))

(deftest test-to-human-distance-800
  (is (= (to-human-distance 800) "800m") "800m does not show km:s"))

(deftest test-pace-from-exercise
  (let [ex {:duration 30000 :distance 1000}] ;; is 5min/km
    (is (= "5.00 min/km" (get-pace ex)) "Pace in min/km.")))

(deftest test-kmh-pace-from-exercise
  (let [ex {:duration (* 210 100 60) :distance 42195 :sport "Pyöräily"}]
    (is (= "12,0 km/h" (get-pace ex)) "Driving marathon 3:30 time.")))

(deftest test-user-time-format
  (is (= "11.05.1978" (to-human-date (time/date-time 1978 5 11))) "Default formatting for exercise date"))


(deftest hr-reserve
  (let [ex {:avghr 142}
        prof {:resthr 42 :maxhr 192}]
    (is (= "67%" (get-heart-rate-reserve ex prof)) "Exercise combines profile and hr if exists.")))

(deftest hr-reserve-no-profile
  (let [ex {}
        prof nil]
    (is (= "" (get-heart-rate-reserve ex prof)) "No profile.")))
