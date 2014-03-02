(ns ontrail.webutil
  (:require [ontrail.auth :as auth]
            [clojure.data.json :as json]
            [clojure.stacktrace :as stacktrace]))

(def logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn get-page [params]
  (if-let [page (:page params)]
    page
    1))

(defmacro json-response [data & [status]]
  `(try
     {:status (or ~status 200)
      :headers {"Content-Type" "application/json"}
      :body (json/json-str ~data)}
     (catch Exception exception#
       (.error logger (str exception#))
       (stacktrace/print-stack-trace exception# 100)
       {:status 500
        :headers {"Content-Type" "application/json"}
        :body (str exception#)})))

(defmacro is-authenticated? [cookies action]
  `(try
     (if (auth/valid-auth-token? (:value (~cookies "authToken")))
       ~action
       (json-response {"error" "Authentication required"} 401))
     (catch Exception exception#
       (.error logger (str exception#))
       (stacktrace/print-stack-trace exception# 100)
       {:status 500
        :headers {"Content-Type" "application/text"}
        :body (str exception#)})))

