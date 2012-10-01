(ns ontrail.test.parser
  (:use ontrail.parser)
  (:use clojure.test))

(deftest test-parse-minutes
  (is (= (parse-duration "60") (parse-duration "60 m")))
  (is (= (parse-duration "60") (parse-duration "60m")))
  (is (= (parse-duration "60") (parse-duration "1 h")))
  (is (= (hours 1) (hours-and-minutes 1 0)))
  (is (= (parse-duration "1:0") (hours 1)))
  (is (= (parse-duration "1.0") 6000))
  (is (= (parse-duration "59.30") (+ (* 59 6000) 3000)))
  (is (= (parse-duration "0.59.30") (+ (* 59 6000) 3000)))
  (is (= (parse-duration "0:59:30") (+ (* 59 6000) 3000)))
  (is (= (parse-duration "2.42,2") 16220)))

(deftest test-parse-tags
  (is (= ["tag1", "tag2"] (parse-tags " tag1,tag2")))
  (is (= ["tag1", "tag2"] (parse-tags " tag1,tag2 "))))
