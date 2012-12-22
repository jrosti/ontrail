(ns ontrail.test.auth
  (:use [ontrail auth user crypto]
        clojure.test))

(deftest username-goes-as-password
    (is (not (authenticate "zxcv" "notvalid"))))

(deftest not-username-fails-as-password
  (is (not (authenticate "Esko" "esko2"))))

(deftest not-existing-username-fails-as-password
  (is (not (authenticate "Esko2" "esko2"))))

(deftest auth-token-can-be-decrypted
  (is (= "Esko|RXNrbw##" (decrypt (auth-token {:username "Esko" :passwordHash "RXNrbw##"})))))

(deftest valid-auth-token-matches
  (let [user (get-user "zxcv")]
    (is (valid-auth-token? (encrypt (str "zxcv|" (hash-part (:passwordHash user)) ))))))