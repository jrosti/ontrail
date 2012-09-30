(ns ontrail.test.mutate
  (:use ontrail.mutate)
  (:use clojure.test))

(deftest test-parse-tags
  (is (= ["tag1", "tag2"] (parse-tags " tag1,tag2")))
  (is (= ["tag1", "tag2"] (parse-tags " tag1,tag2 "))))


(def basic-exercise {:title "A title"
                     :sport "Juoksu"
                     :duration "30"
                     :date "20.4.2012"
                     :distance "10"
                     :avghr "129"
                     :body "Pom"
                     :tags "tag1 tag2 tag3"})

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
  
(deftest test-db-insertable-from-basic-user-ex
  (let [uex (from-user-ex "Esko" basic-exercise)]
    (is (= 10000 (:distance uex)))
    (is (= 129 (:avghr uex)))
    (is (= (* 30 6000) (:duration uex)))))