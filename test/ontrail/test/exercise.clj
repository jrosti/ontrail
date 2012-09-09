(ns ontrail.test.exercise
  (:use ontrail.exercise
        clojure.test)
  (:require [clj-time.core :as time]))

(deftest hr-reserve
  (let [ex {:avghr 142}
        prof {:resthr 42 :maxhr 192}]
    (is (= "67%" (get-heart-rate-reserve ex prof)) "Exercise combines profile and hr if exists.")))

(deftest hr-reserve-no-profile
  (let [ex {}
        prof nil]
    (is (= "" (get-heart-rate-reserve ex prof)) "No profile.")))

(def ex1 {:duration 6000
          :distance 1000
          :sport "Juoksu"
          :body "body"
          :title "title"
          :_id "_id"
          :user "user"
          :comments '()
          :creationDate (time/now)})

(def ex2 {:duration 6000
          :sport "Juoksu"
          :body "body"
          :title "title"
          :_id "_id"
          :user "user"
          :comments '()
          :creationDate (time/now)})

(def ex3 {:duration 600
          :sport "Juoksu"
          :body "body"
          :title "title"
          :_id "_id"
          :user "user"
          :comments '()
          :creationDate (time/now)})

(deftest as-ex-result-test1
  (let [res (as-ex-result ex1)]
    (is (= "title" (:title res)))
    (is (= "1 km" (:distance res)))
    (is (= "Juoksu" (:sport res)))
    (is (= "1 min" (:duration res)))
    (is (= "body" (:body res)))))

(deftest as-ex-result-test2
  (let [res (as-ex-result ex2)]
    (is (= "title" (:title res)))
    (is (= "Juoksu" (:sport res)))
    (is (= "1 min" (:duration res)))
    (is (= "body" (:body res)))))

(deftest as-ex-result-test3
  (let [res (as-ex-result ex3)]
    (is (= "_id" (:id res)))))
  