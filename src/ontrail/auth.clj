(ns ontrail.auth
  (:use ontrail.user ontrail.crypto))

(import com.lambdaworks.codec.Base64)

(defn byte-array-to-string [arr] (apply str arr))
(defn base64-encode [string]
  (byte-array-to-string (Base64/encode (.getBytes string))))

(defn authenticate [user password]
  (= (password-match password (:passwordHash (get-user user)))))

(defn auth-token [user password]
  (str (base64-encode user) ":" (base64-encode password)))

