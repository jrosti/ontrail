(ns s3.webutil
  (:require [s3.auth :as auth]
            [cheshire.core :refer :all]
            )
  (:use [s3 log]))

(use-logging)

(defn url-encode [x]
  (java.net.URLEncoder/encode x))

(defn url-decode [x]
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
  (if data
    {:status 200
     :headers {"Content-Type" "application/json"}
     :body (generate-string data)}
    {:status 400
     :headers {"Content-Type" "application/json"}
     :body "Invalid request."}))

(defmacro no-auth [data & status]
  `(try
     (json-resp ~data)
     (catch Exception ex#
       (error ex#)
       (error-status ex# 400))))

(defmacro user-> [cookies form]
  `(try
     (let [user# (auth/user-from-cookie ~cookies)]
       (json-resp (-> user# ~form)))
     (catch Exception ex#
       (error-status ex# 400))))

(defmacro auth-> [cookies form]
  `(try
     (if (auth/valid-auth-token? (:value (~cookies "authToken")))
       (let [user# (auth/user-from-cookie ~cookies)]
         (json-resp (-> user# ~form)))
       (json-resp {"error" "Authentication required"} 401))
     (catch Exception ex#
       (error ex#)
       (error-status ex# 400))))

(defmacro text-plain-auth-> [cookies form]
  `(try
     (if (auth/valid-auth-token? (:value (~cookies "authToken")))
       (let [user# (auth/user-from-cookie ~cookies)]
         (-> user# ~form))
       (json-resp {"error" "Authentication required"} 401))
     (catch Exception ex#
       (error ex#)
       (error-status ex# 400))))