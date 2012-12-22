(ns ontrail.test.user
  (:use ontrail.user ontrail.crypto clojure.test))

(deftest user-has-password-as-username
  (let [test-account (get-user "zxcv")]
    (is (= "zxcv" (:username test-account)))
    (is (not (password-match? "nomatch" (:passwordHash test-account))))))

(deftest calling-get-user-twice-returns-same-hash
  (is (= (:passwordHash (get-user "zxcv")) (:passwordHash (get-user "zxcv")))))