(ns s3.otroutes
  (:require [ring.middleware.multipart-params :as mp]
            [clojure.edn :as edn]
            [taoensso.timbre :as timbre])
  (:use [s3 webutil formats parser loggedin auth]
        [compojure.core :only [defroutes GET POST DELETE ANY context]]))

(timbre/refer-timbre)

(defroutes ontrail-routes

  (GET "/trail/rest/logged-ins" {cookies :cookies} (json-response (params (user-from-cookie cookies))))

  (GET "/trail/rest/validate/time/:time" [time]
      (let [duration (to-human-time (parse-duration time))]
        (if (= "" duration)
          (json-response {:message "invalid-duration"} 400)
          (json-response {:success true :time duration}))))

  (GET "/trail/rest/validate/distance/:distance" [distance]
      (json-response {:success true :distance (to-human-distance (parse-distance distance))})))

