(ns ontrail.crypto)

(import com.lambdaworks.codec.Base64)


(defn char-array-to-string [arr] (apply str arr))
(defn byte-array-to-string [arr] (apply str (map #(char %) arr))) ; aebaerae -castaus char:ksi, mutta tässä toimii?
(defn base64-encode [string] (char-array-to-string (Base64/encode (.getBytes string))))
(defn base64-decode [string] (byte-array-to-string (Base64/decode (.toCharArray string))))

(defn password-hash [password] (com.lambdaworks.crypto.SCryptUtil/scrypt password 16384 8 1))
(defn password-match? [password hash] (com.lambdaworks.crypto.SCryptUtil/check password hash))
