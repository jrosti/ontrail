(ns ontrail.test.formats
  (:use [ontrail.formats])
  (:use [clojure.test]))

(require '[clj-time.core :as time])

(deftest test-to-human-pace-minkm
  (is (= "6:00min/km" (to-human-pace-minkm (* 100 60 6) 1000)) "Basic pace test."))

(deftest test-to-human-distance
  (is (= (to-human-distance 1000) "1km") "one kilometer is 1km"))

(deftest test-to-human-distance-1001
  (is (= (to-human-distance 1001) "1,001km") "meters"))

(deftest test-to-human-distance-800
  (is (= (to-human-distance 800) "800m") "subkm"))


(deftest test-pace-from-exercise
  (let [ex {:duration 30000 :distance 1000}] ;; is 5min/km
    (is (= "5:00min/km" (get-pace ex)) "Pace in min/km.")))

(deftest test-kmh-pace-from-exercise
  (let [ex {:duration (* 210 100 60) :distance 42195 :sport "Pyöräily"}]
    (is (= "12.05km/h" (get-pace ex)) "Driving marathon 3:30 time.")))

(deftest test-user-time-format
  (is (= "11.05.1978" (to-human-date (time/date-time 1978 5 11))) "Default formatting for exercise time"))