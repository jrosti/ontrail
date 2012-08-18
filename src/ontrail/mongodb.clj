(ns ontrail.mongodb (:require [monger.core :as mg]))

;; localhost, default port
(mg/connect!)
(mg/set-db! (mg/get-db "ontrail"))

