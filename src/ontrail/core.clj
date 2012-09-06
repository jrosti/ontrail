(ns ontrail.core
  (:use aleph.http
        compojure.core
        ring.middleware.file
        ring.middleware.cookies
        [ring.middleware.params :only (wrap-params)]
        [clojure.data.json :only (read-json json-str)])
  (:use [ontrail summary auth crypto user exercise log])
  (:gen-class)
  (:require [compojure.route :as route]
            [monger.collection :as mc]
            [ring.util.response :as response]))

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

(defn to-log-entry [req]
  (str req))

(defn log-and-wrap-dir-index [handler]
  (fn [req]
    (log (to-log-entry req))
    (handler
     (update-in req [:uri]
                #(if (= "/" %) "/index.html" %)))))

(defroutes app-routes
  (GET "/rest/v1/summary/:user" [user] (json-response (get-overall-summary user)))
  (GET "/rest/v1/ex/:id" [id] (json-response (get-ex id)))
  (GET "/rest/v1/ex-list-all/:page" [page] (json-response (get-latest-ex-list {} page)))
  (GET "/rest/v1/ex-list-user/:user/:page" [user page] (json-response (get-latest-ex-list {:user user} page)))
  (GET "/rest/v1/ex-list-tag/:tag/:page" [tag page] (json-response (get-latest-ex-list {:tags tag} page)))
  (POST "/rest/v1/login" [username password]
    (if (authenticate username password)
      (json-response {"token" (auth-token (get-user username)) "username" username} 200)
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
                       log-and-wrap-dir-index
                       wrap-ring-handler)
                     {:host "localhost" :port 8080 :websocket true}))
