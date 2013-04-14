(ns ontrail.core
  (:use aleph.http
        compojure.core
        ring.middleware.file
        ring.middleware.cookies
        [monger.operators :only ($regex)]
        [ring.util.response :only (redirect)]
        [ring.middleware.params :only (wrap-params)]
        [ring.middleware.multipart-params :only (wrap-multipart-params)]
        [clojure.data.json :only (read-json json-str)]
        [ontrail.search :only (search-wrapper rebuild-index)]
        [ontrail.parser :only (parse-duration parse-distance)]
        [ontrail.import :only (import-from-tempfile)])
  (:use [ontrail log scheduler summary auth crypto exercise formats nlp 
         profile system tagsummary sportsummary weekly])
  (:gen-class)
  (:require [ontrail.mongerfilter :as mongerfilter]
            [ontrail.mutate :as mutate]
            [ontrail.exercise :as ex]
            [ontrail.user :as user]
            [ontrail.newcomment :as nc]
            [ontrail.unread :as unread]
            [ontrail.group :as group]
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

(defn get-page [params]
  (if (not= nil (:page params))
    (:page params)
    1))

(defn do-user-action [user-action params]
  (let [user (user-action params)
        username (:username user)]
    (if (and (not= nil username) (not= "nobody" username)) 
      (json-response {"token" (auth-token user) "username" username} 200)
      (json-response {"token" nil "username" username} 404))))

(defn do-group-oper [oper group-name user]
  (let [response (oper group-name user)]
    (if (:result response)
      (json-response {:message (:descr response)})
      (json-response {:message (:descr response)} 400))))

(defroutes app-routes
  (GET "/rest/v1/summary/:user" [user] (json-response (get-overall-summary user)))  
  (GET "/rest/v1/summary/:user/:year" [user year] (json-response (get-year-summary-sport user (Integer/valueOf year))))
  (GET "/rest/v1/summary/:user/:year/bymonth" [user year]
       (json-response (get-season-months get-month-summary-sport user (Integer/valueOf year))))

  (GET "/rest/v1/active-users" [] (json-response (nc/active-users)))
  
  (GET "/rest/v1/summary-tags/:user" [user] (json-response (get-overall-tags-summary user)))
  (GET "/rest/v1/summary-tags/:user/:year" [user year] (json-response (get-year-summary-tags user (Integer/valueOf year))))
  (GET "/rest/v1/summary-tags/:user/:year/bymonth" [user year]
       (json-response (get-season-months get-month-summary-tags user (Integer/valueOf year))))

  (GET "/rest/v1/weekly-list/:user/:year/:month" [user year month]
       (json-response (generate-month user (Integer/valueOf year) (Integer/valueOf month))))
  
  (GET "/rest/v1/profile/:user" [user] (json-response (get-profile user)))
  (POST "/rest/v1/profile" {params :params cookies :cookies}
    (is-authenticated? cookies (json-response (post-profile (user-from-cookie cookies) params))))

  (GET "/rest/v1/email" {cookies :cookies} (json-response {:email (:email (user/get-user (user-from-cookie cookies)))}))
  
  (GET "/rest/v1/system" [] (json-response (get-system-stats)))
  
  (GET "/rest/v1/avatar/:user" [user] (json-response {:url (user/get-avatar-url user)}))
  (GET "/rest/v1/search" {params :params} (json-response (search-wrapper params)))
  
  (GET "/rest/v1/ex/:id" {params :params cookies :cookies}
    (json-response (ex/get-ex (user-from-cookie cookies) (:id params))))
  
  (GET "/rest/v1/ex-list-all/:page" {params :params cookies :cookies}
    (json-response (ex/get-latest-ex-list-default-order (user-from-cookie cookies) {} (get-page params))))

  (GET "/rest/v1/ex-list-filter" {params :params cookies :cookies}
    (json-response (ex/get-latest-ex-list (user-from-cookie cookies) 
      (mongerfilter/make-query-from params) (get-page params) (mongerfilter/sortby params))))
  
  (GET "/rest/v1/ex-unread-comments" {params :params cookies :cookies}
    (json-response (unread/comments-all (user-from-cookie cookies))))

  (GET "/rest/v1/ex-unread-own-comments" {params :params cookies :cookies}
    (json-response (unread/comments-own (user-from-cookie cookies))))  

  (GET "/rest/v1/mark-all-read" {params :params cookies :cookies}
    (json-response (nc/mark-all-read (user-from-cookie cookies))))

  (GET "/rest/v1/ex-list-user/:user/:page" {params :params cookies :cookies}
       (json-response (get-latest-ex-list (user-from-cookie cookies) {:user (:user params)} (get-page params) {:creationDate -1})))
  
  (GET "/rest/v1/ex-list-tag/:tag/:page" {params :params cookies :cookies}
       (json-response (get-latest-ex-list (user-from-cookie cookies) {:tags (:tag params)} (get-page params) {:creationDate -1})))

  (GET "/rest/v1/list-tags/:user" [user] (json-response (get-distinct-tags {:user user})))
  (GET "/rest/v1/list-tags-all" {params :params cookies :cookies} (json-response (get-distinct-tags {:user (user-from-cookie cookies)})))

  (GET "/rest/v1/list-users/:page" [page] (json-response (user/get-user-list {} page)))

  (GET "/rest/v1/find-users/:term/:page" [term page] (json-response (user/get-user-list {:lusername {$regex (str "^" (.toLowerCase term))}} page)))

  (GET "/rest/v1/sports" []  (json-response sports))

  (GET "/rest/v1/parse-time/:time" [time] 
    (let [duration (to-human-time (parse-duration time))]
      (if (= "" duration)
        (json-response {:message "invalid-duration"} 400)
        (json-response {:success true :time duration}))))

  (GET "/rest/v1/parse-distance/:distance" [distance]
       (json-response {:distance (to-human-distance (parse-distance distance))}))
  
  (POST "/rest/v1/login" [username password]
    (if (authenticate username password)
      (json-response {:token (auth-token (user/get-case-user username)) :username (:username (user/get-case-user username))} 200)
      (json-response {:error "Authentication failed"} 401)))
  
  (POST "/rest/v1/ex/:id/comment" {params :params cookies :cookies}
    (is-authenticated? cookies (json-response (mutate/comment-ex (user-from-cookie cookies) params))))
  
  (POST "/rest/v1/update/:id" {params :params cookies :cookies}
    (is-authenticated? cookies (json-response (mutate/update-ex (user-from-cookie cookies) params))))
  
  (DELETE "/rest/v1/ex/:ex-id" {params :params cookies :cookies}
    (is-authenticated? cookies (json-response (mutate/delete-ex (user-from-cookie cookies) (:ex-id params)))))

  (DELETE "/rest/v1/ex/:ex-id/own/comment/:comment-id" {params :params cookies :cookies}
    (is-authenticated? cookies (json-response (mutate/delete-own-comment (user-from-cookie cookies) (:ex-id params) (:comment-id params)))))

  (DELETE "/rest/v1/own/ex/:ex-id/comment/:comment-id" {params :params cookies :cookies}
    (is-authenticated? cookies (json-response (mutate/delete-own-ex-comment (user-from-cookie cookies) (:ex-id params) (:comment-id params)))))

  (POST "/rest/v1/ex/:user" {params :params cookies :cookies}
    (is-authenticated? cookies (json-response (mutate/create-ex (user-from-cookie cookies) params))))

  (POST "/rest/v1/register" {params :params cookies :cookies}
    (do-user-action user/register-user params))

  (POST "/rest/v1/change-password" {params :params cookies :cookies}
    (do-user-action (partial user/change-password (user-from-cookie cookies)) params))

  (GET "/rest/v1/username-available/:username" [username]
    (if-let [user (user/get-case-user username)]
      (json-response {:message "username-exists"} 400)
      (json-response {:success true})))
  
  (GET "/rest/v1/groups/:page" {params :params cookies :cookies}
    (json-response (group/as-list (:page params) (user-from-cookie cookies))))

  (POST "/rest/v1/groups/:name/join" {params :params cookies :cookies}
    (is-authenticated? cookies
      (do-group-oper group/join-to (:name params) (user-from-cookie cookies))))

  (POST "/rest/v1/groups/:name/part" {params :params cookies :cookies}
    (is-authenticated? cookies
      (let [response (group/part-from (:name params) (user-from-cookie cookies))]
        (if (:result response)
          (json-response {:message (:descr response)})
          (json-response {:message (:descr response)} 400)))))

  (wrap-multipart-params
    (POST "/rest/v1/import" {params :params cookies :cookies}
         (redirect (import-from-tempfile (user-from-cookie cookies) (:tempfile (get params :file))))))
  
  (route/resources "/")
  (route/not-found {:status 404}))

(defn -main [& args]
  (.info logger "Starting to build index")
  (future (.info logger (str "Search terms in index: " (time (rebuild-index)))))
  (nc/newcomment-cache-restore-all)
  (schedule-work nc/newcomment-cache-store-all 240) ;; store new comment cache every 60 s
  (start-http-server (-> app-routes
                         handler/site
                         ring-head/wrap-head
                         wrap-cookies
                         wrap-with-logger
                         wrap-dir-index
                         wrap-ring-handler)
                     {:host "localhost" :port 8080 :websocket true}))
