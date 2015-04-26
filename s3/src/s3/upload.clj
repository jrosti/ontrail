(ns s3.upload
  (:require [aws.sdk.s3 :as s3]
            [ring.middleware.multipart-params :as mp]
            [clojure.edn :as edn]
            [clojure.string :as string])
  (:use [s3 webutil auth log]
        [ring.util.response :only [redirect]]
        [cheshire.core :only [generate-string]]
        [compojure.core :only [defroutes GET POST DELETE ANY context]])
  (:import java.awt.image.BufferedImage
           java.io.File
           javax.imageio.ImageIO
           org.imgscalr.Scalr))

(use-logging)

(def conf (clojure.edn/read-string (slurp "properties.edn")))
(def creds (:s3 conf))
(def bucket "ontrail")
(def cdn "http://c.ontrail.net")
(def upload-url "/file-upload/upload.html")

(def formats {:png ".png" :gif ".gif" :jpg ".jpg"})

(defn image-size [buffered-image]
  (when buffered-image
    {:width (.getWidth buffered-image) :height (.getHeight buffered-image)}))

(defn read-image [file]
  (when file
    (try
      (ImageIO/read file)
      (catch Exception e
        (error (.getMessage e))))))

(defn temp-file [format]
  (when format
    (File/createTempFile "upload-resize" (formats format))))

(defn write-image [buffered-image format]
  (when buffered-image
    (try
      (let [output (temp-file format)]
        (ImageIO/write buffered-image (name format) output)
        output)
      (catch Exception e
        (error (.getMessage e))))))

(defn resize [buffered-image size]
  (when buffered-image
    (try
      (Scalr/resize buffered-image size nil)
      (catch Exception e
        (trace e)
        (error (.getMessage e))))))

(def max-image-size 1500)

(defn resize-if-required [format tempfile]
  (if format
    (if-let [bi (read-image tempfile)]
      (let [{width :width height :height} (image-size bi)]
        (if (or (> width max-image-size)
                (> height max-image-size))
          (-> bi
              (resize max-image-size)
              (write-image format))
          tempfile))
      (error "Cannot read image " tempfile))
    (error "Unknown image format " format tempfile)))

(defn image-format-of [filename]
  (when filename
    (first
      (first
        (filter (fn [[_ suffix]]
                  (.endsWith filename suffix)) formats)))))

(defn put-original [tempfile s3-name format]
  (let [name-for-orig (string/replace
                        s3-name
                          (re-pattern (format "\\.%s" (name format)))
                          (str "-orig." (name format)))]
    (info "Putting original to " name-for-orig)
    (future (s3/put-object creds bucket name-for-orig tempfile))))

(defn put-file [user image]
  (let [key-name #(str "u/" (% user) "/" (% (:filename image)))
        s3-name (key-name identity)
        tempfile (:tempfile image)
        format (image-format-of (:filename image))
        access-name (key-name url-encode)]
    (if-let [resized-file (resize-if-required format tempfile)]
      (do
          ;; we do not want to put original files.
          ;(put-original tempfile s3-name format)
          (s3/put-object creds bucket s3-name resized-file)
          (.delete resized-file)
          (str cdn "/" access-name))
      (do
        (error "Failed to put for " user " image " image)
        (throw (IllegalArgumentException. "Invalid object for upload."))))))


(defn put-and-redirect [user image]
  (let [cdn-name (put-file user image)]
    (redirect (str upload-url "?o=" cdn-name))))

(def content-length (comp :content-length :metadata))

(defn encode-parts [key]
  (apply str
    (interpose "/"
      (->> (clojure.string/split key #"/")
           (map url-encode)))))

(defn list-s3-for [user]
  (filter #(> (content-length %) 0)
    (:objects (s3/list-objects creds bucket {:prefix (str "u/" user "/")}))))

(defn s3dir [user]
  (->> (list-s3-for user)
       (map
        (fn [obj]
          {:length (content-length obj)
           :url (str cdn "/" (encode-parts (:key obj)))}))))


(defroutes upload-routes

  (mp/wrap-multipart-params
    (POST "/file-upload/put" {params :params cookies :cookies}
        (text-plain-auth-> cookies (put-and-redirect (:image params)))))

  (GET "/s3list" {params :params}
    (let [u (:userprofile params)]
      {:status 200
       :headers {"Content-Type" "application/json"
                 "Access-Control-Allow-Origin" "*"}
       :body (generate-string {:results  (s3dir u) :user u})}))

  )
