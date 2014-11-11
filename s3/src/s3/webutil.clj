(ns s3.webutil
  (:require [clojure.data.json :as json]
            [s3.auth :as auth]))


(defn url-encode [x] 
  (java.net.URLEncoder/encode x))

(defn url-encode [x]
  (java.net.URLDecoder/decode x))

(defmacro json-response [data & [status]]
  `(try
     {:status (or ~status 200)
      :headers {"Content-Type" "application/json"}
      :body (json/json-str ~data)}
     (catch Exception exception#
       {:status 500
        :headers {"Content-Type" "application/json"}
        :body (str exception#)})))

(defmacro is-authenticated? [cookies action]
  `(try
     (if (auth/valid-auth-token? (:value (~cookies "authToken")))
       ~action
       (json-response {"error" "Authentication required"} 401))
     (catch Exception exception#
       {:status 500
        :headers {"Content-Type" "application/text"}
        :body (str exception#)})))
