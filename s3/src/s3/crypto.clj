(ns s3.crypto
  (:import (org.apache.commons.codec.binary Hex, Base64))
  (:import (javax.crypto Cipher Mac))
  (:import (javax.crypto.spec IvParameterSpec SecretKeySpec)))

(def properties (clojure.edn/read-string (slurp "properties.edn")))

(defn md5
  "Generate a md5 checksum for the given string"
  [token]
  (let [hash-bytes
        (doto (java.security.MessageDigest/getInstance "MD5")
          (.reset)
          (.update (.getBytes token)))]
    (.toString
      (new java.math.BigInteger 1 (.digest hash-bytes)) 
      16)))

(defn md5-match? [string expected] (= (md5 string) expected))

(defn get-bytes [in] (if (string? in) (.getBytes in) in))

(defn byte-array-to-string [arr]
  (String. arr)) 

(defn base64-encode [bytes-or-string] (byte-array-to-string (Base64/encodeBase64URLSafeString (get-bytes bytes-or-string))))
(defn base64-decode [bytes-or-string] (Base64/decodeBase64 (get-bytes bytes-or-string)))

(defn password-hash [password] (com.lambdaworks.crypto.SCryptUtil/scrypt password 16384 8 1))
(defn password-match? [password hash] (com.lambdaworks.crypto.SCryptUtil/check password hash))

(def KEY (.getBytes (:KEY (:auth properties))))
(def MACKEY (.getBytes (:MACKEY (:auth properties))))

(defn new-aes-cipher [] (Cipher/getInstance "AES/CTR/NoPadding"))

(defn encrypt-aes [plain key]
  (let [aes-cipher
         (doto (new-aes-cipher)
           (.init Cipher/ENCRYPT_MODE (new SecretKeySpec KEY "AES")))
        cipher (.doFinal aes-cipher plain)
        iv (.getIV aes-cipher)]
    [iv cipher]))

(defn decrypt-aes [cipher key iv]
  (let [aes-cipher
         (doto (new-aes-cipher)
           (.init Cipher/DECRYPT_MODE (new SecretKeySpec KEY "AES") (new IvParameterSpec iv)))]
      (.doFinal aes-cipher cipher)))

;  todo -- validate cipher -- HMAC?
(defn encrypt [plaintext]
  (let [[iv cipher] (encrypt-aes (.getBytes plaintext "UTF-8") KEY)]
    (base64-encode (byte-array (concat iv cipher)))))

;  todo -- validate cipher -- HMAC?
(defn decrypt [encoded]
  (let [[iv cipher] (split-at 16 (base64-decode encoded))]
    (byte-array-to-string (decrypt-aes (byte-array cipher) KEY (byte-array iv)))))

