(ns ontrail.core
  (:use compojure.core
        [compojure.handler :as handler]
        ring.middleware.cookies
        [monger.operators :only ($regex)]
        [ring.util.response :only (redirect)]
        [ring.middleware.params :only (wrap-params)]
        [ring.middleware.multipart-params :only (wrap-multipart-params)]
        [clojure.data.json :only (read-json json-str)]
        [ontrail.search :only (search-wrapper rebuild-index!)]
        [ontrail.parser :only (parse-duration parse-distance)]
        [ontrail.profile :only (post-profile)]
        )
  (:use [ontrail log scheduler summary auth crypto exercise formats nlp 
         sportsummary mongodb])
  (:gen-class)
  (:require [aleph.http :as aleph]
            [ontrail.v2routes :as v2routes]
            [ontrail.webutil :as webutil]
            [ontrail.websocket :as websocket]
            [ontrail.pages :as pages]
            [ontrail.csv :as csv]
            [ontrail.stats :as stats]
            [ontrail.weekly :as weekly]
            [ontrail.loggedin :as loggedin]
            [ontrail.mongerfilter :as mongerfilter]
            [ontrail.mutate :as mutate]
            [ontrail.exercise :as ex]
            [ontrail.user :as user]
            [ontrail.newcomment :as nc]
            [ontrail.unread :as unread]
            [ontrail.group :as group]
            [ring.middleware.head :as ring-head]
            [compojure.handler :as handler]
            [compojure.route :as route]
            [monger.collection :as mc]
            [ring.util.response :as response]
            [clj-stacktrace.repl :as strp]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))
(def #^{:private true} request-logger (org.slf4j.LoggerFactory/getLogger (str *ns* ".requests")))

(defn wrap-dir-index [handler]
  (fn [req]
    (handler
      (update-in req [:uri] #(if (= "/" %) "/index.html" %)))))

(defn do-user-action [user-action params]
  (let [user (user-action params)
        username (:username user)]
    (if (and username (not= "nobody" username)) 
      (webutil/json-response {"token" (auth-token user) "username" username} 200)
      (webutil/json-response {"token" nil "username" username} 404))))

(defn do-group-oper [oper group-name user]
  (let [response (oper group-name user)]
    (if (:result response)
      (webutil/json-response {:message (:descr response)})
      (webutil/json-response {:message (:descr response)} 400))))

(defroutes v1routes

  (GET "/rest/v1/export.csv" {params :params}
       {:status 200
        :headers {"Content-Type" "application/csv"}
        :body (csv/export params)})

  (GET "/rest/v1/summary/:user" [user] (webutil/json-response (get-overall-summary user)))  
  (GET "/rest/v1/summary/:user/:year" [user year] (webutil/json-response (get-year-summary-sport user (Integer/valueOf year))))
  (GET "/rest/v1/summary/:user/:year/bymonth" [user year]
       (webutil/json-response (get-season-months get-month-summary-sport user (Integer/valueOf year))))

  (GET "/rest/v1/summary/:user/:year/by/week" [user year]
       (let [year-int (Integer/valueOf year)]
         (webutil/json-response {:year year-int :results (weekly/generate-year user year-int) :user user})))
  
  (GET "/rest/v1/summary-tags/:user" [user] (webutil/json-response (get-overall-tags-summary user)))
  (GET "/rest/v1/summary-tags/:user/:year" [user year] (webutil/json-response (get-year-summary-tags user (Integer/valueOf year))))
  (GET "/rest/v1/summary-tags/:user/:year/bymonth" [user year]
       (webutil/json-response (get-season-months get-month-summary-tags user (Integer/valueOf year))))

  (GET "/rest/v1/weekly-list/:user/:year/:month" [user year month]
       (webutil/json-response {:results (weekly/generate-month user (Integer/valueOf year) (Integer/valueOf month)) :user user}))
  
  
  (POST "/rest/v1/profile" {params :params cookies :cookies}
    (webutil/is-authenticated? cookies (webutil/json-response (post-profile (user-from-cookie cookies) params))))

  (GET "/rest/v1/system" [] (webutil/json-response (loggedin/system))) 

  (GET "/rest/v1/logged-ins" {cookies :cookies} (webutil/json-response (loggedin/params (user-from-cookie cookies))))

  (GET "/rest/v1/search" {params :params} (webutil/json-response (search-wrapper params)))
  
  (GET "/rest/v1/ex/:id" {params :params cookies :cookies}
    (webutil/json-response (ex/get-ex (user-from-cookie cookies) (:id params))))
  
  (GET "/rest/v1/ex-list-all/:page" {params :params cookies :cookies}
    (webutil/json-response {:results (ex/get-latest-ex-list-default-order (user-from-cookie cookies) {} (webutil/get-page params))}))

  (GET "/rest/v1/ex-list-filter" {params :params cookies :cookies}
    (webutil/json-response {:results 
                    (ex/get-latest-ex-list (user-from-cookie cookies) 
                                           (mongerfilter/make-query-from params) (webutil/get-page params) 
                                           (mongerfilter/sortby params))}))
  
  (GET "/rest/v1/ex-unread-comments" {params :params cookies :cookies}
    (webutil/json-response (unread/comments-all (user-from-cookie cookies))))

  (GET "/rest/v1/ex-unread-own-comments" {params :params cookies :cookies}
    (webutil/json-response (unread/comments-own (user-from-cookie cookies))))  

  (GET "/rest/v1/ex-most-comments" {params :params cookies :cookies}
    (webutil/json-response (unread/most-comments (user-from-cookie cookies))))

  (GET "/rest/v1/mark-all-read" {params :params cookies :cookies}
    (webutil/json-response (nc/mark-all-read (user-from-cookie cookies))))

  (GET "/rest/v1/list-users/:page" [page] (webutil/json-response {:results (user/get-user-list {} page)}))

  (GET "/rest/v1/find-users/:term/:page" [term page] 
       (webutil/json-response {:results (user/get-user-list {:lusername {$regex (str "^" (.toLowerCase term))}} page)}))

  (GET "/rest/v1/validate/time/:time" [time]
    (let [duration (to-human-time (parse-duration time))]
      (if (= "" duration)
        (webutil/json-response {:message "invalid-duration"} 400)
        (webutil/json-response {:success true :time duration}))))

  (GET "/rest/v1/validate/distance/:distance" [distance]
       (webutil/json-response {:success true :distance (to-human-distance (parse-distance distance))}))

  (GET "/rest/v1/validate/username/:username" [username]
    (if-let [user (user/get-case-user username)]
      (webutil/json-response {:message "username-exists"} 400)
      (webutil/json-response {:success true})))

  (POST "/rest/v1/validate/login" [username password]
    (if (authenticate username password)
      (webutil/json-response {:success true})
      (webutil/json-response {:message "wrong-password"} 400)))

  (POST "/rest/v1/login" [username password]
        (if (authenticate username password)
          (webutil/json-response {:token (auth-token (user/get-case-user username)) :username (:username (user/get-case-user username))} 200)
          (webutil/json-response {:error "Authentication failed"} 401)))
  
  (POST "/rest/v1/ex/:id/comment" {params :params cookies :cookies}
    (webutil/is-authenticated? cookies (webutil/json-response (mutate/comment-ex (user-from-cookie cookies) params))))
  
  (POST "/rest/v1/update/:id" {params :params cookies :cookies}
    (webutil/is-authenticated? cookies (webutil/json-response (mutate/update-ex (user-from-cookie cookies) params))))
  
  (DELETE "/rest/v1/ex/:ex-id" {params :params cookies :cookies}
    (webutil/is-authenticated? cookies (webutil/json-response (mutate/delete-ex (user-from-cookie cookies) (:ex-id params)))))

  (DELETE "/rest/v1/ex/:ex-id/own/comment/:comment-id" {params :params cookies :cookies}
    (webutil/is-authenticated? cookies (webutil/json-response (mutate/delete-own-comment (user-from-cookie cookies) (:ex-id params) (:comment-id params)))))

  (DELETE "/rest/v1/own/ex/:ex-id/comment/:comment-id" {params :params cookies :cookies}
    (webutil/is-authenticated? cookies (webutil/json-response (mutate/delete-own-ex-comment (user-from-cookie cookies) (:ex-id params) (:comment-id params)))))

  (POST "/rest/v1/ex/:user" {params :params cookies :cookies}
    (webutil/is-authenticated? cookies (webutil/json-response (mutate/create-ex (user-from-cookie cookies) params))))

  (POST "/rest/v1/register" {params :params cookies :cookies}
    (do-user-action user/register-user params))

  (POST "/rest/v1/change-password" {params :params cookies :cookies}
    (do-user-action (partial user/change-password (user-from-cookie cookies)) params))

  (GET "/rest/v1/page-detail" {params :params cookies :cookies}
    (let [action (keyword (:action params))
          target (action params)
          action-fn (case action :group group/group-detail :user group/user-detail (partial stats/sport-detail params))]
      (webutil/json-response (action-fn target (user-from-cookie cookies)))))

  (GET "/rest/v1/own-groups" {params :params cookies :cookies}
    (webutil/json-response (group/own-as-list (user-from-cookie cookies))))
  
  (GET "/rest/v1/groups/:page" {params :params cookies :cookies}
    (webutil/json-response (group/as-list (:page params) (user-from-cookie cookies))))

  (POST "/rest/v1/groups/:name/join" {params :params cookies :cookies}
    (webutil/is-authenticated? cookies
      (do-group-oper group/join-to (:name params) (user-from-cookie cookies))))

  (POST "/rest/v1/groups/:name/part" {params :params cookies :cookies}
    (webutil/is-authenticated? cookies
      (do-group-oper group/part-from (:name params) (user-from-cookie cookies))))  
  (route/resources "/")
  (route/not-found {:status 404}))

(def app-routes
  (routes              
   websocket/async
   v2routes/v2routes 
   pages/templates
   v1routes))

(def ring-handler
  (-> app-routes
      handler/site
      wrap-dir-index
      ring-head/wrap-head
;;      wrap-with-logger ;; removed because there is quite redundant nginx logging.
      aleph/wrap-ring-handler))

(def app (-> (handler/site app-routes)))

(defn -main [& args]
  (.info logger "Starting to build index")
  (future (.info logger (str "Search terms in index: " (time (rebuild-index!)))))
  (nc/newcomment-cache-restore-all)
  (schedule-work nc/newcomment-cache-store-all 2400)
  (aleph/start-http-server ring-handler
                     {:port 8080 :websocket true}))
