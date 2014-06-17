(ns ontrail.mongodb (:require [monger.core :as mg]))

(def ^:const DB "ontrail")

;; Mongo collection names
(def ^:const ONUSER "onuser")
(def ^:const NCCACHE "nccache")
(def ^:const EXERCISE "exercise")
(def ^:const ONSPORT "onsport")
(def ^:const GROUPS "groups")

;; Connect to localhost, default port
(def ^:dynamic *conn* (mg/connect))
(def ^:dynamic *db* (mg/get-db *conn* DB))

;;(mg/connect!)
;;(mg/authenticate (mg/get-db DB) "xxx" "xxxxpppp")
;;(mg/set-db! (mg/get-db DB))
