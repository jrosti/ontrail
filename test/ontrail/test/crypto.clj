(ns ontrail.test.crypto
  (:use [ontrail.crypto])
  (:use [clojure.test]))

(deftest hash-properly
  (is (com.lambdaworks.crypto.SCryptUtil/check "keijo" (password-hash "keijo"))))

(deftest match-properly
  (is (password-match? "keijo" (com.lambdaworks.crypto.SCryptUtil/scrypt "keijo" 16384 8 1))))

(deftest base64-decodes
  (is (= "esko" (base64-decode "ZXNrbw=="))))
