(ns ontrail.crypto)

(defn password-hash [password]
  (com.lambdaworks.crypto.SCryptUtil/scrypt password 16384 8 1))

(defn password-match [password hash]
  (com.lambdaworks.crypto.SCryptUtil/check password hash))
