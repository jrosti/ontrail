(ns s3.mongodb (:require [monger.core :as mg]))

(def ^:const DB "ontrail")

(def ^:const ONUSER "onuser")
(def ^:const BLOG "blog")

(def ^:dynamic *conn* (mg/connect))
(def ^:dynamic *db* (mg/get-db *conn* DB))

