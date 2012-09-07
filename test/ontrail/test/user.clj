(ns ontrail.test.user
  (:use ontrail.user ontrail.crypto clojure.test))

(deftest user-has-password-as-username
  (let [test-account (get-user "Esko")]
    (is (= "Esko" (:username test-account)))
    (is (password-match? "Esko" (:passwordHash test-account)))))

(deftest calling-get-user-twice-returns-same-hash
  (is (= (:passwordHash (get-user "Esko")) (:passwordHash (get-user "Esko")))))