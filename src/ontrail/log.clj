(ns ontrail.log
  (:require [clj-time.core :as time]))

(defn log [& args]
  (apply println (cons (str (time/now) ":") args)))