(ns s3.upload
  (:require [aws.sdk.s3 :as s3]
            [ring.middleware.multipart-params :as mp]
            [clojure.edn :as edn]
            [clojure.string :as string])
  (:use [s3 webutil auth log]
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
      (do ;(put-original tempfile s3-name format)
          (s3/put-object creds bucket s3-name resized-file)
          (.delete resized-file)
          (str cdn "/" access-name))
      (do
        (error "Failed to put for " user " image " image)
        (throw (IllegalArgumentException. "Invalid object for upload."))))))


(defroutes upload-routes

  (mp/wrap-multipart-params
    (POST "/file-upload/put" {params :params cookies :cookies}
        (text-plain-auth-> cookies (put-file (:file params)))))

  )