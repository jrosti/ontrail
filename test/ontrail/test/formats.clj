(ns ontrail.test.formats
  (:use [ontrail.formats])
  (:use [clojure.test]))

(require '[clj-time.core :as time])

(deftest basic-pace
  (is (= "6:00min/km" (to-human-pace 6.0)) "Basic pace test."))

(deftest user-time-format
  (is (= "11.05.1978" (to-human-date (time/date-time 1978 5 11))) "Default formatting for exercise time"))