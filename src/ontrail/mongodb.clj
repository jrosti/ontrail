(ns ontrail.mongodb (:require [monger.core :as mg]))

(def DB "ontrail")

;; Mongo collection names
(def ONUSER "onuser")
(def NCCACHE "nccache")
(def EXERCISE "exercise")
(def ONSPORT "onsport")
(def GROUPS "groups")

;; Connect to localhost, default port
(mg/connect!)
(mg/set-db! (mg/get-db DB))

;;(mg/connect!)
;;(mg/authenticate (mg/get-db DB) "xxx" "xxxxpppp")
;;(mg/set-db! (mg/get-db DB))
