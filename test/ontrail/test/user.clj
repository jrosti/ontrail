(ns ontrail.test.user
  (:use ontrail.user ontrail.crypto)
  (:use [clojure.test]))

(deftest user-has-password-as-username
  (let [test-account (get-user "esko")]
    (is (= "esko" (:username test-account)))
    (is (password-match? "esko" (:passwordHash test-account)))))

(deftest calling-get-user-twice-returns-same-hash
  (is (= (:passwordHash (get-user "esko")) (:passwordHash (get-user "esko")))))