(ns ontrail.websocket
  (:require [lamina.core :as lamina]
            [aleph.http :as aleph]
            [clojure.data.json :as json]
            [ontrail.auth :as auth]
            [ontrail.formats :as formats]
            [ontrail.scheduler :as scheduler]
            [clj-time.local :as local]
            )
  (:use [compojure.core]
        [ontrail.scheduler])
  (:import [java.lang IllegalStateException]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn message-init [ch]
  (lamina/receive-all ch #(.info logger (str "chatty message: " %))))

(def message-channel (lamina/named-channel "messages" message-init))

(def heartbeat 
  (scheduler/schedule-work 
   (fn [] 
     (lamina/enqueue message-channel 
                     (json/write-str {:user "Ontrail" 
                                      :action "sanoi" 
                                      :message (formats/to-human-comment-date (local/local-now))})))
   3600)) ;; seconds

(defn message-handler [user ch]
  (let [user-channel (lamina/map* (fn [json]
                                    (let [value (json/read-str json)]
                                      (json/write-str (merge value {:user user}))))
                                  ch)]
    (lamina/siphon user-channel message-channel)
    (lamina/siphon message-channel ch)))

(defn connect-message [user ch request]
  (if (:websocket request)
    (message-handler user ch)
    (throw (IllegalStateException. "Attempting non-websocket operation on websocket route."))))

(defroutes async
  (GET "/rest/v1/async" {cookies :cookies}
       (let [user (auth/user-from-cookie cookies)]
         (if (not= "nobody" user)
           (aleph/wrap-aleph-handler (partial connect-message user))
           {:status 200}))))

(defn ex-link [ex]
  (str "ex/" 
       (if-let [id (:id ex)] 
         id 
         (:_id ex))))

(defn server-message [type user value]
  (condp = type
    :comment-ex {:user user :action "kommentoi viestiä" :message (:title value) :link (ex-link value)}
    :create-ex {:user user 
                :action "kirjasi harjoituksen" 
                :message (:title value) 
                :link (ex-link value)}))

(defn submit [type user value]
  (lamina/enqueue message-channel (json/write-str (server-message type user value))))
