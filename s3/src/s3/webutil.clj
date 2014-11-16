(ns s3.webutil
  (:require [s3.auth :as auth]
            [cheshire.core :refer :all]
            )
  (:use [s3 log]))

(use-logging)

(defn url-encode [x]
  (java.net.URLEncoder/encode x))

(defn url-encode [x]
  (java.net.URLDecoder/decode x))

(defn log-request? [request response]
  (or (.startsWith (:uri request) "/trail/rest")
      (> (:status response) 200)))

(defn wrap-with-logger [handler]
  (fn [request]
    (let [response (handler request)]
      (if (log-request? request response)
        (trace request response))
      response)))

(defn error-status [ex & status]
  {:status (or status 500)
   :headers {"Content-Type" "application/text"}
   :body (str ex)})

(defn json-resp [data & status]
  {:status (or status 200)
   :headers {"Content-Type" "application/json"}
   :body (generate-string data)})

(defmacro no-auth [data & [status]]
  `(try
     (let [result# ~data]
       (if result#
         (json-resp ~data ~status)
         (error-status "Invalid reqeust: None." 400)))
     (catch Exception ex#
       (error-status ex#))))

(defmacro user-> [cookies form]
  `(try
     (let [user# (auth/user-from-cookie ~cookies)]
       (json-resp (-> user# ~form)))
     (catch Exception ex#
       (error-status ex#))))

(defmacro auth-> [cookies form]
  `(try
     (if (auth/valid-auth-token? (:value (~cookies "authToken")))
       (let [user# (auth/user-from-cookie ~cookies)]
         (json-resp (-> user# ~form)))
       (json-resp {"error" "Authentication required"} 401))
     (catch Exception ex#
       (error-status ex#))))

