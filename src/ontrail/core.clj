(ns ontrail.core
  (:use
        aleph.http
        compojure.core)
  (:gen-class)
  (:require [compojure.route :as route]))

(require '[monger.collection :as mc])
(use 'ring.middleware.file)
(use 'ring.middleware.cookies)
(use '[ring.middleware.params :only (wrap-params)])
(use '[clojure.data.json :only (read-json json-str)])
(use '[clojure.string :only (split)])

(use '[ontrail.summary])

(defn json-response [data & [status]]
  {:status (or status 200)
   :headers {"Content-Type" "application/json"}
   :body (json-str data)})

(defn authenticate [user password]
  (= user password))

(defn auth-token [user password]
  (str user ":" password))

(defn is-authenticated? [cookies action]
  (let [auth-token (:value (cookies "authToken"))
        [user, password] (split auth-token #":")]
    (if (authenticate user password)
      action
      (json-response {"error" "Authentication required"} 401))))

(defroutes app-routes
  "Routes requests to their handler function. Captures dynamic variables."
  (GET "/summary/:user" [user] (json-response (get-overall-summary user)))
  (POST "/login" [username password]
      (if (authenticate username password)
        (json-response {"token" (auth-token username password) "user" username} 200)
        (json-response {"error" "Authentication failed"} 401)))
  (GET "/secret" [] (is-authenticated? (json-response {"secret" "ken sent me"})))

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
