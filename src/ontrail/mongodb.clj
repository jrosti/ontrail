(ns ontrail.mongodb (:require [monger.core :as mg]))

(def DB "ontrail")

;; Mongo collection names
(def ONUSER "onuser")
(def EXERCISE "exercise")
(def ONSPORT "onsport")

;; Connect to localhost, default port
(mg/connect!)
(mg/set-db! (mg/get-db DB))

