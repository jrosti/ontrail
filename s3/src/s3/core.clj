(ns s3.core
  (:require [aws.sdk.s3 :as s3]
            [ring.middleware.multipart-params :as mp]
            [clojure.edn :as edn])

  (:use [s3 webutil auth]
        [ring.util.response :only [redirect]]
        [compojure.route :only [files not-found resources]]
        [compojure.handler :only [site]]
        [compojure.core :only [defroutes GET POST DELETE ANY context]]
        org.httpkit.server)
  (:gen-class))

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

;; {:image {:size 39471, :tempfile #<File /var/folders/xz/0k0hh83j23505jgpk6ft5wxc0000gn/T/ring-multipart-5695352225985151282.tmp>,
;; :content-type image/png, :filename small.png}}

(defroutes all-routes
  (mp/wrap-multipart-params
    (POST "/file-upload/put" {params :params cookies :cookies}
          (is-authenticated?
           cookies
           (let [user (user-from-cookie cookies)
                 cdn-url (put-file user (:image params))]
             (redirect (str upload-url "?o=" (url-encode cdn-url)))))))
  (resources "/")
  (not-found "not found"))

(defn -main [& args]
  (run-server (site #'all-routes) {:port 8081}))
