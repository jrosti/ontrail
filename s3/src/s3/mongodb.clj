(ns s3.mongodb (:require [monger.core :as mg]))

(def ^:const DB "ontrail")

(def ^:const ONUSER "onuser")
(def ^:const BLOG "blog")
(def ^:const BLOG_DEL "blog_del")

(def ^:dynamic *conn* (mg/connect))
(def ^:dynamic *db* (mg/get-db *conn* DB))

