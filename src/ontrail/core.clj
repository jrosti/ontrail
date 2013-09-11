(ns ontrail.core
  (:use aleph.http
        compojure.core
        ring.middleware.cookies
        [monger.operators :only ($regex)]
        [ring.util.response :only (redirect)]
        [ring.middleware.params :only (wrap-params)]
        [ring.middleware.multipart-params :only (wrap-multipart-params)]
        [clojure.data.json :only (read-json json-str)]
        [ontrail.search :only (search-wrapper rebuild-index)]
        [ontrail.parser :only (parse-duration parse-distance)]
        [ontrail.profile :only (post-profile)]
        )
  (:use [ontrail log scheduler summary auth crypto exercise formats nlp 
         sportsummary weekly mongodb])
  (:gen-class)
  (:require [ontrail.loggedin :as loggedin]
            [ontrail.mongerfilter :as mongerfilter]
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

(defroutes json-routes
  (GET "/summary/:user" [user :as {headers :headers}]
    ;;    (if (= "XMLHttpRequest" (get headers "x-requested-with"))
    (json-response (get-overall-summary user)))
    ;;     "<h1>Hello World</h1>"))
    (GET "/summary/:user/:year" [user year] (json-response (get-year-summary-sport user (Integer/valueOf year))))
    (GET "/summary/:user/:year/bymonth" [user year]
      (json-response (get-season-months get-month-summary-sport user (Integer/valueOf year))))

    (GET "/summary-tags/:user" [user] (json-response (get-overall-tags-summary user)))
    (GET "/summary-tags/:user/:year" [user year] (json-response (get-year-summary-tags user (Integer/valueOf year))))
    (GET "/summary-tags/:user/:year/bymonth" [user year]
      (json-response (get-season-months get-month-summary-tags user (Integer/valueOf year))))

    (GET "/weekly-list/:user/:year/:month" [user year month]
      (json-response {:results (generate-month user (Integer/valueOf year) (Integer/valueOf month))}))

    (POST "/profile" {params :params cookies :cookies}
      (is-authenticated? cookies (json-response (post-profile (user-from-cookie cookies) params))))

    (GET "/system" [] (json-response (loggedin/system)))

    (GET "/logged-ins" {cookies :cookies} (json-response (loggedin/params (user-from-cookie cookies))))

    (GET "/search" {params :params} (json-response (search-wrapper params)))

    (GET "/ex/:id" {params :params cookies :cookies}
      (json-response (ex/get-ex (user-from-cookie cookies) (:id params))))

    (GET "/ex-list-all/:page" {params :params cookies :cookies}
      (json-response {:results (ex/get-latest-ex-list-default-order (user-from-cookie cookies) {} (get-page params))}))

    (GET "/ex-list-filter" {params :params cookies :cookies}
      (json-response {:results
                      (ex/get-latest-ex-list (user-from-cookie cookies)
                        (mongerfilter/make-query-from params) (get-page params)
                        (mongerfilter/sortby params))}))

    (GET "/ex-unread-comments" {params :params cookies :cookies}
      (json-response (unread/comments-all (user-from-cookie cookies))))

    (GET "/ex-unread-own-comments" {params :params cookies :cookies}
      (json-response (unread/comments-own (user-from-cookie cookies))))

    (GET "/ex-most-comments" {params :params cookies :cookies}
      (json-response (unread/most-comments (user-from-cookie cookies))))

    (GET "/mark-all-read" {params :params cookies :cookies}
      (json-response (nc/mark-all-read (user-from-cookie cookies))))

    (GET "/ex-list-user/:user/:page" {params :params cookies :cookies}
      (json-response (get-latest-ex-list (user-from-cookie cookies) {:user (:user params)} (get-page params) {:creationDate -1})))

    (GET "/ex-list-tag/:tag/:page" {params :params cookies :cookies}
      (json-response (get-latest-ex-list (user-from-cookie cookies) {:tags (:tag params)} (get-page params) {:creationDate -1})))

    (GET "/list-users/:page" [page] (json-response {:results (user/get-user-list {} page)}))

    (GET "/find-users/:term/:page" [term page]
      (json-response {:results (user/get-user-list {:lusername {$regex (str "^" (.toLowerCase term))}} page)}))

    (GET "/validate/time/:time" [time]
      (let [duration (to-human-time (parse-duration time))]
        (if (= "" duration)
          (json-response {:message "invalid-duration"} 400)
          (json-response {:success true :time duration}))))

    (GET "/validate/distance/:distance" [distance]
      (json-response {:success true :distance (to-human-distance (parse-distance distance))}))

    (GET "/validate/username/:username" [username]
      (if-let [user (user/get-case-user username)]
        (json-response {:message "username-exists"} 400)
        (json-response {:success true})))

    (POST "/validate/login" [username password]
      (if (authenticate username password)
        (json-response {:success true})
        (json-response {:message "wrong-password"} 400)))

    (POST "/login" [username password]
      (if (authenticate username password)
        (json-response {:token (auth-token (user/get-case-user username)) :username (:username (user/get-case-user username))} 200)
        (json-response {:error "Authentication failed"} 401)))

    (POST "/ex/:id/comment" {params :params cookies :cookies}
      (is-authenticated? cookies (json-response (mutate/comment-ex (user-from-cookie cookies) params))))

    (POST "/update/:id" {params :params cookies :cookies}
      (is-authenticated? cookies (json-response (mutate/update-ex (user-from-cookie cookies) params))))

    (DELETE "/ex/:ex-id" {params :params cookies :cookies}
      (is-authenticated? cookies (json-response (mutate/delete-ex (user-from-cookie cookies) (:ex-id params)))))

    (DELETE "/ex/:ex-id/own/comment/:comment-id" {params :params cookies :cookies}
      (is-authenticated? cookies (json-response (mutate/delete-own-comment (user-from-cookie cookies) (:ex-id params) (:comment-id params)))))

    (DELETE "/own/ex/:ex-id/comment/:comment-id" {params :params cookies :cookies}
      (is-authenticated? cookies (json-response (mutate/delete-own-ex-comment (user-from-cookie cookies) (:ex-id params) (:comment-id params)))))

    (POST "/ex/:user" {params :params cookies :cookies}
      (is-authenticated? cookies (json-response (mutate/create-ex (user-from-cookie cookies) params))))

    (POST "/register" {params :params cookies :cookies}
      (do-user-action user/register-user params))

    (POST "/change-password" {params :params cookies :cookies}
      (is-authenticated? cookies
        (do-user-action (partial user/change-password (user-from-cookie cookies)) params)))

    (GET "/page-detail/:action/:aname" {params :params cookies :cookies}
      (let [action-fn (case (:action params) "group" group/group-detail "user" group/user-detail group/other-detail)]
        (json-response (action-fn (:aname params) (user-from-cookie cookies)))))

    (GET "/own-groups" {params :params cookies :cookies}
      (json-response (group/own-as-list (user-from-cookie cookies))))

    (GET "/groups/:page" {params :params cookies :cookies}
      (json-response (group/as-list (:page params) (user-from-cookie cookies))))

    (POST "/groups/:name/join" {params :params cookies :cookies}
      (is-authenticated? cookies
        (do-group-oper group/join-to (:name params) (user-from-cookie cookies))))

    (POST "/groups/:name/part" {params :params cookies :cookies}
      (is-authenticated? cookies
        (do-group-oper group/part-from (:name params) (user-from-cookie cookies))))
    )

(defroutes app-routes
  (context "/rest/v1" [] json-routes)
  (route/resources "/")
  (route/not-found {:status 404}))

(defn -main [& args]
  (.info logger "Starting to build index")
  (future (.info logger (str "Search terms in index: " (time (rebuild-index)))))
  (nc/newcomment-cache-restore-all)
  (schedule-work nc/newcomment-cache-store-all 600)
  (start-http-server (-> app-routes
                         handler/site
                         ring-head/wrap-head
                         wrap-with-logger
                         wrap-dir-index
                         wrap-ring-handler)
                     {:host "localhost" :port 8080 :websocket true}))
