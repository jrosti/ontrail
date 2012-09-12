(ns ontrail.test.auth
  (:use [ontrail auth user crypto]
        clojure.test))

(deftest username-goes-as-password
    (is (authenticate "Esko" "Esko")))

(deftest not-username-fails-as-password
  (not (is (authenticate "Esko" "esko2"))))

(deftest auth-token-returns-base64-encoded-strings
  (is (= "RXNrbw##|RXNrbw##" (auth-token {:username "Esko" :passwordHash "RXNrbw##"}))))

(deftest valid-auth-token-matches
  (let [user (get-user "Esko")]
    (is (valid-auth-token? (str "RXNrbw##|" (clojure.string/replace (hash-part (:passwordHash user)) #"=" "#"))))))