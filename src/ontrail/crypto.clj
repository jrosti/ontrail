(ns ontrail.crypto)

(import com.lambdaworks.codec.Base64)

(defn md5
  "Generate a md5 checksum for the given string"
  [token]
  (let [hash-bytes
        (doto (java.security.MessageDigest/getInstance "MD5")
          (.reset)
          (.update (.getBytes token)))]
    (.toString
      (new java.math.BigInteger 1 (.digest hash-bytes)) ; Positive and the size of the number
      16)))

(defn md5-match? [string expected] (= (md5 string) expected))

(defn char-array-to-string [arr] (apply str arr))
(defn byte-array-to-string [arr] (apply str (map #(char %) arr))) ; aebaerae -castaus char:ksi, mutta tässä toimii?
(defn base64-encode [string] (char-array-to-string (Base64/encode (.getBytes string))))
(defn base64-decode [string] (byte-array-to-string (Base64/decode (.toCharArray string))))

(defn password-hash [password] (com.lambdaworks.crypto.SCryptUtil/scrypt password 16384 8 1))
(defn password-match? [password hash] (com.lambdaworks.crypto.SCryptUtil/check password hash))
