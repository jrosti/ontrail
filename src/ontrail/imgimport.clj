(ns ontrail.imgimport
  (:use [ontrail mongodb mongerfilter])
  (:use clojure.java.io)
  (:require [clojure.java.io :as io]
            [monger.collection :as mc]
            [monger.result :as mr]
            [net.cgrand.enlive-html :as html]
            [clojure.string :as string]
            [clj-time.core :as time]
            ;; for date serialization to mongo.
            [monger.joda-time])
  (:import [java.io File]))

(defn imgs[body]
  (let [body-html (html/html-snippet body)]
    (mapv (comp :src :attrs) (flatten (html/select body-html [:img])))))

(def qfilter (make-query-from {:gte_creationDate "1.11.2013"}))

(defn find-all-imgs[]
  (let [bodies (map (fn [res] {:id (:_id res) :body (:body res)}) (mc/find-maps *db* EXERCISE qfilter))]
    (filter :id (mapv (fn [res] 
                        (let [imglist (imgs (:body res))]
                          (if (> (count imglist) 0)
                            {:id (:id res) :imgs (flatten (concat (imgs (:body res)) (mapv imgs (res (comp :body :comments)))))}
                            {}))) bodies))))

(defn print-all[]
   (let [results (find-all-imgs)]
     (reverse (flatten 
      (mapv (fn [result] 
              (let [id-string (.toString (:id result))
                    imagelist (:imgs result)]
                (mapv 
                 (fn [img] 
                   (format "<a href=\"/#ex/%s\"><img height=\"700\" src=\"%s\"</img></a>\n" 
                           id-string img))
                 imagelist))) results)))))
   
   

(defn write-result [] 
  (with-open [wrtr (writer "kollaasi.html")]
    (mapv #(.write wrtr %) (print-all))))

(defn -main [& args]
  (write-result))
