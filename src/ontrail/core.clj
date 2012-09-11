(ns ontrail.core
  (:use aleph.http
        compojure.core
        ring.middleware.file
        ring.middleware.cookies
        [ring.middleware.params :only (wrap-params)]
        [clojure.data.json :only (read-json json-str)]
        [ontrail.search :only (search-wrapper rebuild-index)]
        [ontrail.user :only (get-avatar-url get-user)]
        [ontrail.mutate :only (create-ex-wrapper)])
  (:use [ontrail summary auth crypto exercise log])
  (:gen-class)
  (:require [compojure.handler :as handler]
            [compojure.route :as route]
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

(defn log-and-wrap-dir-index [handler]
  (fn [req]
    (log "HTTP" (to-logline req))
    (handler
     (update-in req [:uri]
                #(if (= "/" %) "/index.html" %)))))

(defroutes app-routes
  (GET "/rest/v1/summary/:user" [user] (json-response (get-overall-summary user)))
  (GET "/rest/v1/avatar/:user" [user] (json-response {:url (get-avatar-url user)}))
  (GET "/rest/v1/search" {params :params} (json-response (search-wrapper params)))
  
  (GET "/rest/v1/ex/:id" [id] (json-response (get-ex id)))
  (GET "/rest/v1/ex-list-all/:page" [page] (json-response (get-latest-ex-list {} page)))
  (GET "/rest/v1/ex-list-user/:user/:page" [user page] (json-response (get-latest-ex-list {:user user} page)))
  (GET "/rest/v1/ex-list-tag/:tag/:page" [tag page] (json-response (get-latest-ex-list {:tags tag} page)))
  (POST "/rest/v1/login" [username password]
    (if (authenticate username password)
      (json-response {"token" (auth-token (get-user username)) "username" username} 200)
      (json-response {"error" "Authentication failed"} 401)))
  (GET "/secret" {params :params cookies :cookies} (is-authenticated? params cookies (json-response {"secret" "ken sent me"})))

  ;; testing needed
  ;;(PUT "/rest/v1/put-ex/:user" [user body] (json-response (create-ex-wrapper user body)))
  
  (route/resources "/")
  (route/not-found "Page not found"))

(defn -main [& args]
  (rebuild-index) ;; builds in-memory index for fast searches
  (start-http-server (-> app-routes
                         handler/site
                         wrap-cookies
                         log-and-wrap-dir-index
                         wrap-ring-handler)
                     {:host "localhost" :port 8080 :websocket true}))
