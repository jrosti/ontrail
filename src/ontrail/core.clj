(ns ontrail.core
  (:use lamina.core
        aleph.http
        compojure.core)
  (:gen-class)
  (:require [compojure.route :as route]))

(require '[monger.collection :as mc])
(use 'ring.middleware.file)
(use 'ring.middleware.cookies)
(use '[clojure.data.json :only (read-json json-str)])

(use '[ontrail.summary])

(defn json-response [data & [status authToken]]
  {:status (or status 200)
   :headers {"Content-Type" "application/json"}
   :cookies (if authToken {"authToken" authToken} {})
   :body (json-str data)})

(defroutes app-routes
  "Routes requests to their handler function. Captures dynamic variables."
  (GET "/summary/:user" [user] (json-response (get-overall-summary user)))
  (route/resources "/")
  (route/not-found "Page not found"))

(defn -main [& args]
  "Main thread for the server which starts an async server with
  all the routes we specified and is websocket ready."
  (start-http-server (-> app-routes
                       wrap-cookies
                       wrap-ring-handler)
                     {:host "localhost" :port 8080 :websocket true}))
