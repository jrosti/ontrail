(ns s3.apiroutes
  (:require [ring.middleware.multipart-params :as mp]
            [clojure.edn :as edn]
            )
  (:use [s3 webutil formats parser loggedin auth user log]
        [compojure.core :only [defroutes GET POST DELETE ANY context]]))

(use-logging)

(defn- create-draft [user]
  {:id "Random-id" :user user})

(defroutes api-routes

  (context "/trail/rest" []

    (POST "/login" {params :params headers :headers}
         (let [username (:username params)
               password (:password params)
               redirect-location (if-let [param-referer (:referer params)]
                                   param-referer
                                   (if-let [referer (headers "referer")] referer "/"))]
           (if (authenticate username password)
             (let [user (get-case-user username)
                   authToken (auth-token user)
                   authUser (:username user)]
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

    (ANY "/logout" {params :params headers :headers}
       (let [redirect-location (if-let [param-referer (:referer params)]
                                 param-referer
                                 (if-let [referer (headers "referer")] referer "/"))]
         {:status  301
          :headers {"Content-Type" "text/html"
                    "Location"     redirect-location}
          :cookies {"authToken" {:value "" :max-age 0 :path "/"}
                    "authUser"  {:value "" :max-age 0 :path "/"}}
          :body    ""}))

    (GET "/logged-ins" {cookies :cookies} (json-response (params (user-from-cookie cookies))))

    (GET "/validate/time/:time" [time]
        (let [duration (to-human-time (parse-duration time))]
          (if (= "" duration)
            (json-response {:message "invalid-duration"} 400)
            (json-response {:success true :time duration}))))

    (GET "/validate/distance/:distance" [distance]
        (json-response {:success true :distance (to-human-distance (parse-distance distance))}))

    (POST "/blog/draft/new" {params :params cookies :cookies}
       (as-authenticated? cookies #(-> % create-draft json-response)))

  ))

