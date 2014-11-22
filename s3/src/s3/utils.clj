(ns s3.utils
  (:require [clojure.string :as string])
  (:import [java.io File]))

(defn file-exists? [^String filename]
  (.exists (File. filename)))

(defn parse-int [^String int-str]
  (try
    (Integer/parseInt int-str)
    (catch Exception e
      0)))

(defn parse-boolean [^String bool-str]
  (Boolean/parseBoolean bool-str))

(defn truncate 
  ([str] 
     (truncate str 100))
  ([str n]
   (if (= 0 (count str))
     ""
     (subs str 0 (min (count str) n)))))

(defn float= [x y]
  (<= (Math/abs (- x y)) 0.00001))

(defn positive-numbers? [vals]
  (reduce #(and %1 %2) (map #(and (not= nil %) (> % 0)) vals)))

(defn strip-html [^String val]
  (-> val
      (string/replace #"&[^;]*;" " ")
      (string/replace #"<[^>]*>" " ")))

(defn to-lower [^String value]
  (when value
    (.toLowerCase value)))
