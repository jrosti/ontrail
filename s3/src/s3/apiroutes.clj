(ns s3.apiroutes
  (:require [ring.middleware.multipart-params :as mp]
            [clojure.edn :as edn]
            [s3.blog :as blog])
  (:use [s3 webutil formats parser loggedin auth user log]
        [compojure.core :only [defroutes GET POST DELETE ANY context]]))

(use-logging)

(defroutes api-routes (context "/trail/rest" []

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

    (GET "/logged-ins" {cookies :cookies}
         (auth-> cookies (logged-in)))

    (GET "/validate/time/:time" [time]
         (let [duration (to-human-time (parse-duration time))]
            (if (= "" duration)
              (no-auth {:message "invalid-duration"} 400)
              (no-auth {:success true :time duration}))))

    (GET "/validate/distance/:distance" [distance]
         (no-auth {:success true
                         :distance (to-human-distance (parse-distance distance))}))

    (POST "/blog/draft/new" {cookies :cookies}
          (auth-> cookies blog/create-new-draft))

    (POST "/blog/:id" {blog :params cookies :cookies}
          (auth-> cookies (blog/update-with blog)))

    (GET "/blog/:id" {params :params cookies :cookies}
          (user-> cookies (blog/find-by (:id params))))

    (DELETE "/blog/:id" {params :params cookies :cookies}
            (auth-> cookies (blog/delete-by (:id params))))

    (GET "/blog/list/all" {params :params cookies :cookies}
         (user-> cookies (blog/list-by params)))

    (GET "/blog/list/drafts" {params :params cookies :cookies}
         (auth-> cookies (blog/list-drafts params)))


    ))

