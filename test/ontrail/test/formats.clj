(ns ontrail.test.formats
  (:use [ontrail.formats])
  (:use [clojure.test]))

(require '[clj-time.core :as time])

(deftest human-pace
  (is (= "6:00min/km" (to-human-pace 6.0)) "Basic pace test."))

(deftest pace-from-exercise
  (let [ex {:duration 30000 :distance 1000}] ;; is 5min/km
    (is (= "5:00min/km" (get-pace ex)) "Pace in min/km.")))

(deftest user-time-format
  (is (= "11.05.1978" (to-human-date (time/date-time 1978 5 11))) "Default formatting for exercise time"))