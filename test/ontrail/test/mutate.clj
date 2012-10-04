(ns ontrail.test.mutate
  (:use ontrail.mutate)
  (:use clojure.test))

(deftest failing (is false))

(def basic-exercise {:title "A title"
                     :sport "Juoksu"
                     :duration "30"
                     :date "20.4.2012"
                     :distance "10"
                     :avghr "129"
                     :body "Pom"
                     :tags "tag1 tag2 tag3"})
  
(deftest test-db-insertable-from-basic-user-ex
  (let [uex (from-user-ex "Esko" basic-exercise)]
    (is (= 10000 (:distance uex)))
    (is (= 129 (:avghr uex)))
    (is (= (* 30 6000) (:duration uex)))))