(ns ontrail.test.auth
  (:use [ontrail.auth])
  (:use [clojure.test]))

(deftest username-goes-as-password
    (is (authenticate "esko" "esko")))

(deftest not-username-fails-as-password
  (not (is (authenticate "esko" "esko2"))))
