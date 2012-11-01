(ns ontrail.core
  (:use aleph.http
        compojure.core
        ring.middleware.file
        ring.middleware.cookies
        ring.middleware.logger
        [monger.operators :only ($regex)]
        [ring.util.response :only (redirect)]
        [ring.middleware.params :only (wrap-params)]
        [clojure.data.json :only (read-json json-str)]
        [ontrail.search :only (search-wrapper rebuild-index)]
        [ontrail.user :only (get-avatar-url get-user get-user-list register-user)]
        [ontrail.parser :only (parse-duration parse-distance)]
        [ontrail.mutate :only (update-ex create-ex comment-ex
                                         delete-ex delete-own-comment delete-own-ex-comment)])
  (:use [ontrail summary auth crypto exercise formats nlp profile system tagsummary weekly])
  (:gen-class)
  (:require
            [ring.middleware.head :as ring-head]
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
       (stacktrace/print-stack-trace exception# 100)
       {:status 500
        :headers {"Content-Type" "application/text"}
        :body (str exception#)})))

(defmacro is-authenticated? [cookies action]
  `(try
     (if (valid-auth-token? (:value (~cookies "authToken")))
       ~action
       (json-response {"error" "Authentication required"} 401))
     (catch Exception exception#
       (.error logger (str exception#))
       (stacktrace/print-stack-trace exception# 100)
       {:status 500
        :headers {"Content-Type" "application/text"}
        :body (str exception#)})))

(defn wrap-dir-index [handler]
  (fn [req]
    (handler
      (update-in req [:uri] #(if (= "/" %) "/index.html" %)))))

(defroutes app-routes
  (GET "/rest/v1/summary/:user" [user] (json-response (get-overall-summary user)))  
  (GET "/rest/v1/summary/:user/:year" [user year] (json-response (get-year-summary-sport user (Integer. year))))
  (GET "/rest/v1/summary/:user/:year/bymonth" [user year] (json-response (get-season-months user (Integer. year))))

  (GET "/rest/v1/summary-tags/:user" [user] (json-response (get-overall-tags-summary user)))
  (GET "/rest/v1/summary-tags/:user/:year" [user year] (json-response (get-year-summary-tags user (Integer. year))))
  (GET "/rest/v1/summary-tags/:user/:year/bymonth" [user year] (json-response (get-season-months-tags user (Integer. year))))

  (GET "/rest/v1/weekly/:user" {params :params} (json-response (weekly-wrapper params)))
  
  (GET "/rest/v1/profile/:user" [user] (json-response (get-profile user)))
  (POST "/rest/v1/profile" {params :params cookies :cookies}
    (is-authenticated? cookies (json-response (post-profile (user-from-cookie cookies) params))))

  (GET "/rest/v1/email" {cookies :cookies} (json-response {:email (:email (get-user (user-from-cookie cookies)))}))
  
  (GET "/rest/v1/system" [] (json-response (get-system-stats)))
  
  (GET "/rest/v1/avatar/:user" [user] (json-response {:url (get-avatar-url user)}))
  (GET "/rest/v1/search" {params :params} (json-response (search-wrapper params)))

  (GET "/rest/v1/throw" [] (json-response (throw (Exception. "Test Exception"))))
  
  (GET "/rest/v1/ex/:id" [id] (json-response (get-ex id)))
  (GET "/rest/v1/ex-list-newer/:datetime" [datetime] (json-response (get-newer-ex-than datetime)))
  (GET "/rest/v1/ex-list-all/:page" [page] (json-response (get-latest-ex-list {} page)))
  (GET "/rest/v1/ex-list-user/:user/:page" [user page] (json-response (get-latest-ex-list-with-sort-rule {:user user} page {:creationDate -1})))
  
  (GET "/rest/v1/ex-list-tag/:tag/:page" [tag page] (json-response (get-latest-ex-list {:tags tag} page)))

  (GET "/rest/v1/list-tags/:user" [user] (json-response (get-distinct-tags {:user user})))
  (GET "/rest/v1/list-tags-all" [] (json-response (get-distinct-tags {})))

  (GET "/rest/v1/list-users/:page" [page] (json-response (get-user-list {} page)))

  (GET "/rest/v1/find-users/:term/:page" [term page] (json-response (get-user-list {:username {$regex (str "^" term)}} page)))

  (GET "/rest/v1/sports" []  (json-response sports))

  (GET "/rest/v1/parse-time/:time" [time] ;; XXX throws
       (let [duration (to-human-time (parse-duration time))]
         (if (= "" duration)
           (json-response {:message "invalid-duration"} 400)
           (json-response {:success true :time duration}))))
  
  (GET "/rest/v1/parse-distance/:distance" [distance]
       (json-response {:distance (to-human-distance (parse-distance distance))}))
  
  (POST "/rest/v1/login" [username password]
        (if (authenticate username password)
          (json-response {"token" (auth-token (get-user username)) "username" username} 200)
          (json-response {"error" "Authentication failed"} 401)))
  
  (POST "/rest/v1/ex/:id/comment" {params :params cookies :cookies}
        (is-authenticated? cookies (json-response (comment-ex (user-from-cookie cookies) params))))
  
  (POST "/rest/v1/update/:id" {params :params cookies :cookies}
        (is-authenticated? cookies (json-response (update-ex (user-from-cookie cookies) params))))
  
  (DELETE "/rest/v1/ex/:ex-id" {params :params cookies :cookies}
          (is-authenticated? cookies (json-response (delete-ex (user-from-cookie cookies) (:ex-id params)))))

  (DELETE "/rest/v1/ex/:ex-id/own/comment/:comment-id" {params :params cookies :cookies}
    (is-authenticated? cookies (json-response (delete-own-comment (user-from-cookie cookies) (:ex-id params) (:comment-id params)))))

  (DELETE "/rest/v1/own/ex/:ex-id/comment/:comment-id" {params :params cookies :cookies}
    (is-authenticated? cookies (json-response (delete-own-ex-comment (user-from-cookie cookies) (:ex-id params) (:comment-id params)))))

  (POST "/rest/v1/ex/:user" {params :params cookies :cookies}
        (is-authenticated? cookies (json-response (create-ex (user-from-cookie cookies) params))))

  (POST "/rest/v1/register" {params :params cookies :cookies}
      (let [user (register-user params)]
        (json-response {"token" (auth-token user) "username" (:username user)} 200)))

  (route/resources "/")
  (route/not-found {:status 404}))

(defn -main [& args]
  (.info logger "Starting to build index")
  (future (.info logger (str "Search terms in index: " (time (rebuild-index))))) 
  (start-http-server (-> app-routes
                         handler/site
                         ring-head/wrap-head
                         wrap-cookies
                         wrap-with-logger
                         wrap-dir-index
                         wrap-ring-handler)
                     {:host "localhost" :port 8080 :websocket true}))
