(ns s3.core
  (:require [aws.sdk.s3 :as s3]
            [ring.middleware.multipart-params :as mp]
            [clojure.edn :as edn])
  (:use [s3 webutil auth apiroutes loginroutes log]
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
          (is-authenticated?
           cookies
           (let [user (user-from-cookie cookies)
                 cdn-url (put-file user (:file params))]
             {:status 200
              :headers {"Content-Type" "text/plain"}
              :body (url-encode cdn-url)}))))
  (GET "/" {}
    (resource-response "index.html" {:root "public"}))
  (resources "/")
  (not-found "not found"))

(defroutes all-routes
  (routes api-routes main-routes))

(def app (-> (site all-routes)
             (wrap-with-logger)))

(defn -main [& args]
  (info "Hello Brave new world!")
  (run-server app {:port 8081}))
