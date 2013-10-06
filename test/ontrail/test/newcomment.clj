(ns ontrail.test.newcomment
  (:use [ontrail.newcomment])
  (:use [clojure.test]))

(deftest get-or-creaste
  (is (= {} @(dosync (get-or-create-usercache "username")))))
