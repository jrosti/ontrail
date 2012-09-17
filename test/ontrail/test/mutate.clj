(ns ontrail.test.mutate
  (:use ontrail.mutate)
  (:use clojure.test))

(deftest test-parse-tags
  (is (= ["tag1", "tag2"] (parse-tags " tag1,,tag2")))
  (is (= ["tag1", "tag2"] (parse-tags " tag1//*tag2 "))))


(def basic-exercise {:title "A title"
                     :sport "Juoksu"
                     :duration "30"
                     :date "20.4.2012"
                     :distance "10000"
                     :avghr "129"
                     :body "Pom"
                     :tags "tag1 tag2 tag3"})

(deftest basic-exercise-is-valid
  (is (valid? basic-exercise)))

(deftest test-parse-distance
  (let [hour (* 60 60 100)]
    (is (= hour (parse-distance "1h")))))

(deftest test-db-insertable-from-basic-user-ex
  (is (= {:title "A title"
          :body "Pom"
          :sport "Juoksu"
          :user "Esko"
          :tags ["tag1", "tag2", "tag3"]
          :comments '()
          :avghr 0
          :distance 10000
          :duration (* 30 60 100)
          :creationDate (parse-date "20.4.2012")
          :lastModifiedDate (parse-date "20.4.2012")}
         (from-user-ex "Esko" basic-exercise))
         "Basic user data import test."))