(ns ontrail.core
  (:use
        aleph.http
        compojure.core)
  (:use [ontrail summary auth crypto user])
  (:gen-class)
  (:require [compojure.route :as route]))

(require '[monger.collection :as mc])
(use 'ring.middleware.file)
(use 'ring.middleware.cookies)
(use '[ring.middleware.params :only (wrap-params)])
(use '[clojure.data.json :only (read-json json-str)])

(defn json-response [data & [status]]
  {:status (or status 200)
   :headers {"Content-Type" "application/json"}
   :body (json-str data)})

(defn is-authenticated? [params cookies action]
    (let [auth-token (:value (cookies "authToken"))
        auth-token-hash (:tokenHash params)]
    (if (valid-auth-token? auth-token)
      action
      (json-response {"error" "Authentication required"} 401))))

(defroutes app-routes
  "Routes requests to their handler function. Captures dynamic variables."
  (GET "/summary/:user" [user] (json-response (get-overall-summary user)))
  (POST "/login" [username password]
    (if (authenticate username password)
      (json-response {"token" (auth-token (get-user username)) "user" username} 200)
      (json-response {"error" "Authentication failed"} 401)))
  (GET "/secret" {params :params cookies :cookies} (is-authenticated? params cookies (json-response {"secret" "ken sent me"})))

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
