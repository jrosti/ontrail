(ns ontrail.utils
  (:require [clojure.string :as string])
  (:import [java.io File]))

(defn file-exists? [^String filename]
  (.exists (File. filename)))

(defn parse-int [^String int-str]
  (try
    (Integer/parseInt int-str)
    (catch Exception e
      0)))

(defn truncate 
  ([str] 
     (truncate str 100))
  ([str n]
     (subs str 0 (min (count str) n))))

(defn float= [x y]
  (<= (Math/abs (- x y)) 0.00001))

(defn positive-numbers? [vals]
  (reduce #(and %1 %2) (map #(and (not= nil %) (> % 0)) vals)))

(defn strip-html [^String val]
   (string/replace val #"<[^>]*>" " "))

(defn to-lower [^String value]
  (.toLowerCase value))
