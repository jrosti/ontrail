(ns s3.core
  (:require [aws.sdk.s3 :as s3]
            [ring.middleware.multipart-params :as mp]
            [clojure.edn :as edn])
  (:use [s3 webutil auth apiroutes loginroutes log]
        [ring.middleware.json :only [wrap-json-params]]
        [ring.util.response :only [redirect resource-response]]
        [compojure.route :only [files not-found resources]]
        [compojure.handler :only [site]]
        [compojure.core :only [defroutes GET POST DELETE ANY context routes]]
        org.httpkit.server)
  (:gen-class))

(use-logging)

(def conf (clojure.edn/read-string (slurp "properties.edn")))
(def creds (:s3 conf))
(def bucket "ontrail")
(def cdn "http://c.ontrail.net")
(def upload-url "/file-upload/upload.html")

(defn put-file [user image]
  (let [key-name #(str "u/" (% user) "/" (% (:filename image)))
        s3-name (key-name identity)
        access-name (key-name url-encode)]
    (s3/put-object creds bucket s3-name (:tempfile image))
    (str cdn "/" access-name)))

(defroutes main-routes
  (mp/wrap-multipart-params
    (POST "/file-upload/put" {params :params cookies :cookies}
          (auth-> cookies (put-file (:file params)))))

  (GET "/" {}
    (resource-response "index.html" {:root "public"}))
  (GET "/edit/" {}
    (resource-response "edit.html" {:root "pages"}))
  (GET "/edit/:blogId" [blog-id]
    (resource-response "edit.html" {:root "pages"}))
  (resources "/")
  (not-found "not found"))

(defroutes all-routes
  (routes api-routes main-routes))

(def app (-> (site all-routes)
             (wrap-json-params {:keywords? true :bigdecimals? true})
             wrap-with-logger))

(defn -main [& args]
  (run-server app {:port 8081}))
