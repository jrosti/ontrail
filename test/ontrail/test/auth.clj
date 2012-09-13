(ns ontrail.test.auth
  (:use [ontrail auth user crypto]
        clojure.test))

(deftest username-goes-as-password
    (is (authenticate "Esko" "Esko")))

(deftest not-username-fails-as-password
  (not (is (authenticate "Esko" "esko2"))))

(deftest auth-token-can-be-decrypted
  (is (= "Esko|RXNrbw##" (decrypt (auth-token {:username "Esko" :passwordHash "RXNrbw##"})))))

(deftest valid-auth-token-matches
  (let [user (get-user "Esko")]
    (is (valid-auth-token? (encrypt (str "Esko|" (hash-part (:passwordHash user)) ))))))