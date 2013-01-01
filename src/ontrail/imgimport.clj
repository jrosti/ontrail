(ns ontrail.imgimport
  (:use [ontrail mongodb])
  (:require [clojure.java.io :as io]
            [monger.collection :as mc]
            [monger.result :as mr]
            [net.cgrand.enlive-html :as html]
            [clojure.string :as string]
            [clj-time.core :as time]
            ;; for date serialization to mongo.
            [monger.joda-time])
  (:import [java.io File]))

(defn find-all-imgs[]
  (let [bodies (map :body (mc/find-maps EXERCISE {}))
        body-htmls (map html/html-snippet bodies)
        img-tags (flatten (map #(html/select % [:img]) body-htmls))]
    (map (comp :src :attrs) img-tags)))    
    
(defn print-all[]
  (doall (for [img (find-all-imgs)] (printf "%s\n" img))))


(defn -main [& args]
  (print-all))