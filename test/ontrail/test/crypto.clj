(ns ontrail.test.crypto
  (:use [ontrail.crypto])
  (:use [clojure.test]))

(deftest hash-properly
  (is (com.lambdaworks.crypto.SCryptUtil/check "keijo" (password-hash "keijo"))))

(deftest match-properly
  (is (password-match? "keijo" (com.lambdaworks.crypto.SCryptUtil/scrypt "keijo" 16384 8 1))))

(deftest not-match-invalid-pwd
  (not (password-match? "keijo2" (com.lambdaworks.crypto.SCryptUtil/scrypt "keijo" 16384 8 1))))

(deftest base64-decodes
  (is (= "esko" (byte-array-to-string (base64-decode "ZXNrbw==")))))

(deftest encrypt-and-decrypt-does-what-it-should-do
  (is (= "foo2" (decrypt (encrypt "foo2")))))

(deftest decrypt-does-what-it-should-do
  (is (= "foo2" (decrypt "hcmlYlBedinIG2d5PohVCRKkEGg="))))