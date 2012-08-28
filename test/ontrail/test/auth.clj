(ns ontrail.test.auth
  (:use [ontrail auth user crypto])
  (:use [clojure.test]))

(deftest username-goes-as-password
    (is (authenticate "esko" "esko")))

(deftest not-username-fails-as-password
  (not (is (authenticate "esko" "esko2"))))

(deftest auth-token-returns-base64-encoded-strings
  (is (= "ZXNrbw==:ZXNrbw==" (auth-token "esko" "esko"))))

(deftest valid-auth-token-matches
  (let [user (get-user "esko")]
    (is (valid-auth-token? (str "ZXNrbw==:" (base64-encode (:passwordHash user)))))))