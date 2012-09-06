(ns ontrail.log
  (:require [clj-time.local :as lt]))


(defn log [& args]
  (apply println (cons (lt/format-local-time (lt/local-now) :date-hour-minute-second-ms) args)))