(ns ontrail.test.import
  (:use [ontrail.import])
  (:use [clojure.test]))

(deftest basic-duration
  (is (= 360000 (to-duration "60.0")) "Basic duration"))

(deftest with-hundreds-duration
  (is (= 6001 (to-duration "1.0,1")) "Hundreds"))
