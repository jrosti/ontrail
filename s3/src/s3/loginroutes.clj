(ns s3.loginroutes
  (:use [compojure.core :only (defroutes POST GET PUT DELETE)])

  (:require [s3.auth :as auth]
            [s3.user :as user]))

(defn logout [params headers]
  (let [redirect-location (if-let [param-referer (:referer params)]
                            param-referer
                            (if-let [referer (headers "referer")] referer "/"))]
    {:status  301
     :headers {"Content-Type" "text/html"
               "Location"     redirect-location}
     :cookies {"authToken" {:value "" :max-age 0 :path "/"}
               "authUser"  {:value "" :max-age 0 :path "/"}}
     :body    ""}))

(defroutes
  routes

  (POST "/rest/v2/login" {params :params headers :headers}
        (let [username (:username params)
              password (:password params)
              redirect-location (if-let [param-referer (:referer params)]
                                  param-referer
                                  (if-let [referer (headers "referer")] referer "/"))]
          (if (auth/authenticate username password)
            (let [case-user (user/get-case-user username)
                  authToken (auth/auth-token case-user)
                  authUser (:username (user/get-case-user username))]
              {:status  301
               :headers {"Content-Type" "text/html"
                         "Location"     redirect-location}
               :cookies {"authToken" {:value authToken :max-age (* 60 60 24 2 365) :path "/"}
                         "authUser"  {:value authUser :max-age (* 60 60 24 2 365) :path "/"}}
               :body    ""
               })
            {:status  301
             :headers {"Content-Type"     "text/html"
                       "Location"         (str redirect-location "?status=login_failed")
                       "X-Ontrail-Status" "login-failed"}
             :body    ""
             })))

  (GET "/rest/v2/logout" {params :params headers :headers}
       (logout params headers))

  (POST "/rest/v2/logout" {params :params headers :headers}
        (logout params headers)))