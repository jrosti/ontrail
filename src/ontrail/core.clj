(ns ontrail.core
  (:use aleph.http
        compojure.core
        ring.middleware.file
        ring.middleware.cookies
        [ring.middleware.params :only (wrap-params)]
        [clojure.data.json :only (read-json json-str)]
        [ontrail.search :only (search-wrapper rebuild-index)]
        [ontrail.user :only (get-avatar-url get-user)]
        [ontrail.mutate :only (create-ex comment-ex)])
  (:use [ontrail summary auth crypto exercise log])
  (:gen-class)
  (:require
            [clojure.stacktrace :as stacktrace]
            [compojure.handler :as handler]
            [compojure.route :as route]
            [monger.collection :as mc]
            [ring.util.response :as response]
            [clj-stacktrace.repl :as strp]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))
(def #^{:private true} request-logger (org.slf4j.LoggerFactory/getLogger (str *ns* ".requests")))

(defmacro json-response [data & [status]]
  `(try
     {:status (or ~status 200)
      :headers {"Content-Type" "application/json"}
      :body (json-str ~data)}
     (catch Exception exception#
       (.error logger (str exception#))
       (stacktrace/print-stack-trace exception#)
       {:status 400
        :headers {"Content-Type" "application/tex"}
        :body (str exception#)})))

(defmacro is-authenticated? [cookies action]
  `(if (valid-auth-token? (:value (~cookies "authToken")))
     ~action
     (json-response {"error" "Authentication required"} 401)))

(defn log-and-wrap-dir-index [handler]
  (fn [req]
    (.info request-logger (str "HTTP" (to-logline req)))
    (handler
      (update-in req [:uri] #(if (= "/" %) "/index.html" %)))))

(defroutes app-routes
  (GET "/rest/v1/summary/:user" [user] (json-response (get-overall-summary user)))
  (GET "/rest/v1/avatar/:user" [user] (json-response {:url (get-avatar-url user)}))
  (GET "/rest/v1/search" {params :params} (json-response (search-wrapper params)))

  (GET "/rest/v1/throw" [] (json-response (throw (Exception. "Test Exception"))))
  
  (GET "/rest/v1/ex/:id" [id] (json-response (get-ex id)))
  (GET "/rest/v1/ex-list-all/:page" [page] (json-response (get-latest-ex-list {} page)))
  (GET "/rest/v1/ex-list-user/:user/:page" [user page] (json-response (get-latest-ex-list {:user user} page)))
  (GET "/rest/v1/ex-list-tag/:tag/:page" [tag page] (json-response (get-latest-ex-list {:tags tag} page)))

  (GET "/rest/v1/list-tags/:user" [user] (json-response (get-distinct-tags {:user user})))
  (GET "/rest/v1/list-tags-all" [] (json-response (get-distinct-tags {})))
  
  (GET "/rest/v1/sports" [] (json-response (get-distinct-sports {})))
  
  (POST "/rest/v1/login" [username password]
    (if (authenticate username password)
      (json-response {"token" (auth-token (get-user username)) "username" username} 200)
      (json-response {"error" "Authentication failed"} 401)))

  (POST "/rest/v1/ex/:id/comment" {params :params cookies :cookies}
    (is-authenticated? cookies (json-response (comment-ex (:username (user-from-token (:value (cookies "authToken")))) params))))

  (POST "/rest/v1/ex/:user" {params :params cookies :cookies}
        (is-authenticated? cookies (json-response (create-ex (:username (user-from-token (:value (cookies "authToken")))) params))))

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
