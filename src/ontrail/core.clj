(ns ontrail.core
  (:use lamina.core
        aleph.http
        compojure.core)
  (:gen-class)
  (:require [compojure.route :as route]))

(require '[monger.collection :as mc])
(use 'ring.middleware.file)
(use 'ring.middleware.cookies)
(use '[ring.middleware.params :only (wrap-params)])
(use '[clojure.data.json :only (read-json json-str)])

(use '[ontrail.summary])

(defn authenticate [user password]
  (and (= user "esko") (= password "morko")))

(defn auth-token [user password]
  (str user ":" password))

(defn json-response [data & [status authToken]]
  {:status (or status 200)
   :headers {"Content-Type" "application/json"}
   :cookies (if authToken {"authToken" authToken} {})
   :body (json-str data)})

(defroutes app-routes
  "Routes requests to their handler function. Captures dynamic variables."
  (GET "/summary/:user" [user] (json-response (get-overall-summary user)))
  (POST "/login" [user password]
    (if (authenticate user password)
      (json-response {"success" "Authentication successful"} 200 (auth-token user password))
      (json-response {"error" "Authentication failed"} 401)))

  (route/resources "/")
  (route/not-found "Page not found"))

(defn -main [& args]
  "Main thread for the server which starts an async server with
  all the routes we specified and is websocket ready."
  (start-http-server (-> app-routes
                       wrap-cookies
                       wrap-params
                       wrap-ring-handler)
                     {:host "localhost" :port 8080 :websocket true}))
