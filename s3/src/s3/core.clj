(ns s3.core
  (:require [aws.sdk.s3 :as s3]
            [ring.middleware.multipart-params :as mp]
            [clojure.edn :as edn])
  (:use [s3 webutil auth apiroutes upload log]
        [ring.middleware.json :only [wrap-json-params]]
        [ring.util.response :only [redirect resource-response]]
        [compojure.route :only [files not-found resources]]
        [compojure.handler :only [site]]
        [compojure.core :only [defroutes GET POST DELETE ANY context routes]]
        org.httpkit.server)
  (:gen-class))

(use-logging)

(defroutes main-routes

  (GET "/" {}
    (redirect "/file-upload/upload.html"))

  (GET "/index" {}
    (resource-response "index.html" {:root "public"}))
  (GET "/edit/" {}
    (resource-response "edit.html" {:root "pages"}))
  (GET "/drafts/" {}
    (resource-response "drafts.html" {:root "pages"}))
  (GET "/entry/:blogId" {}
    (resource-response "entry.html" {:root "pages"}))
  (GET "/edit/:blogId" [blog-id]
    (resource-response "edit.html" {:root "pages"}))
  (resources "/")
  (not-found "not found"))

(defroutes all-routes
  (routes upload-routes api-routes main-routes))

(def app (-> (site all-routes)
             (wrap-json-params {:keywords? true :bigdecimals? true})
             wrap-with-logger))

(def port 8081)
(defn -main [& args]
  (info "Starting server on port " port)
  (run-server app {:port port}))
