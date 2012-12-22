(ns ontrail.test.exercise
  (:use ontrail.exercise
        clojure.test)
  (:require [clj-time.core :as time]))

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

(def ex3 {:duration nil
          :sport "Juoksu"
          :body nil
          :title "title"
          :_id "_id"
          :user nil
          :comments nil
          :creationDate (time/now)})

(deftest as-ex-result-list-test1
  (let [res (as-ex-result ex1)]
    (is (= "title" (:title res)))
    (is (= "1 km" (:distance res)))
    (is (= "Juoksu" (:sport res)))
    (is (= "1 min" (:duration res)))
    (is (= "body" (:body res)))))

(deftest as-ex-result-list-test2
  (let [res (as-ex-result ex2)]
    (is (= "title" (:title res)))
    (is (= "Juoksu" (:sport res)))
    (is (= "1 min" (:duration res)))
    (is (= "body" (:body res)))))

(deftest as-ex-result-list-test3
  (let [res (as-ex-result ex3)]
    (is (= "_id" (:id res)))))
  