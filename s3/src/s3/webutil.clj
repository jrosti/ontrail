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

(defn error-status [ex]
  {:status 500
   :headers {"Content-Type" "application/text"}
   :body (str ex)})

(defmacro no-auth [data & [status]]
  `(try
     (let [result# ~data]
       (if result#
         {:status (or ~status 200)
          :headers {"Content-Type" "application/json"}
          :body (generate-string ~data)}
         {:status 400
          :body "Invalid request"}))
     (catch Exception ex#
       (error-status ex#))))

(defmacro user-> [cookies form]
  `(try
     (let [user# (auth/user-from-cookie ~cookies)]
       (no-auth (-> user# ~form)))
     (catch Exception ex#
       (error-status ex#))))

(defmacro auth-> [cookies form]
  `(try
     (if (auth/valid-auth-token? (:value (~cookies "authToken")))
       (let [user# (auth/user-from-cookie ~cookies)]
         (generate-string (-> user# ~form)))
       (generate-string {"error" "Authentication required"} 401))
     (catch Exception exception#
       {:status 500
        :headers {"Content-Type" "application/text"}
        :body (str exception#)})))

