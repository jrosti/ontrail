(ns ontrail.crypto)

(import com.lambdaworks.codec.Base64)

(defn byte-array-to-string [arr] (apply str arr))
(defn base64-encode [string]
  (byte-array-to-string (Base64/encode (.getBytes string))))


(defn password-hash [password] (com.lambdaworks.crypto.SCryptUtil/scrypt password 16384 8 1))
(defn password-match? [password hash] (com.lambdaworks.crypto.SCryptUtil/check password hash))
