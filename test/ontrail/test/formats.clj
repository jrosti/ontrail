(ns ontrail.test.formats
  (:use [ontrail.formats])
  (:use [clojure.test]))

(deftest basic-pace
  (is (= "6:00min/km" (to-human-pace 6.0)) "Basic pace test."))