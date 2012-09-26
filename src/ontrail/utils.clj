(ns ontrail.utils
  (:require [clojure.string :as string])
  (:import [java.io File]))

(defn file-exists? [filename]
  (.exists (File. filename)))

(defn float= [x y]
  (<= (Math/abs (- x y)) 0.00001))

(defn not-nil? [val]
  (not= val nil))

(defn positive-numbers? [vals]
  (reduce #(and %1 %2) (map #(and (not-nil? %) (> % 0)) vals)))

(defn strip-html [val]
   (string/replace val #"<[^>]*>" " "))