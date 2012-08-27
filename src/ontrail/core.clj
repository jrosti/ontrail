(ns ontrail.core
  (:use lamina.core
        aleph.http
        compojure.core)
  (:gen-class))

(require '[monger.collection :as mc])
(require '[clojure.string])


(use '[clojure.data.json :only (read-json json-str)])

(use '[ontrail.summary])

(defn json-response [data & [status]]
  {:status (or status 200)
   :headers {"Content-Type" "application/json"}
   :body (json-str data)})

(defroutes app-routes
  "Routes requests to their handler function. Captures dynamic variables."
  (GET "/summary/:user" [user] (json-response (get-overall-summary user))))

(defn -main [& args]
  "Main thread for the server which starts an async server with
  all the routes we specified and is websocket ready."
  (start-http-server (wrap-ring-handler app-routes)
                     {:host "localhost" :port 8080 :websocket true}))
