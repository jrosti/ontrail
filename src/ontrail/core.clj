(ns ontrail.core
  (:use [compojure.core :only [defroutes GET]])
  (:require [ring.adapter.jetty :as ring]))

(def db (System/getenv "DATABASE_URL"))

(defroutes routes
  (GET "/" [] "<h2>Hello World</h2>"))

(defn start []
  (ring/run-jetty #'routes {:port 8080 :join? false}))

(defn -main []
	(start))