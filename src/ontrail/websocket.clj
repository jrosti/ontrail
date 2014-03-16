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

(def message-buffer-size 100)

;; Ring for in-memory persistence of last messages. 
;; conjoining to end, popping from beginning.
(def message-ring (atom (clojure.lang.PersistentQueue/EMPTY)))

(defn message-init [ch]
  (lamina/receive-all 
   ch
   (fn [message]
     (.info logger (str "chat message: " message))
     (swap! message-ring conj message)
     (if (> (count @message-ring) message-buffer-size)
       (swap! message-ring pop)))))

;; All websockets from users are connected to message channel, which distributes
;; messages to user channels. 
(def message-channel (lamina/named-channel "messages" message-init))

(defn heartbeat []
  (scheduler/schedule-work 
   (fn [] 
     (lamina/enqueue message-channel 
                     (json/write-str {:user "Ontrail" 
                                      :action "sanoi" 
                                      :message (formats/to-human-comment-date (local/local-now))})))
   1800)) ;; seconds

(defn ex-link [ex]
  (str "ex/" 
       (if-let [id (:id ex)] 
         id 
         (:_id ex))))

(defn server-message [type user value]
  (condp = type
    :comment-ex {:user user 
                 :action (str "kommentoi käyttäjän " (:user value) " harjoitusta") 
                 :message (:title value) 
                 :link (ex-link value)}
    :create-ex {:user user 
                :action "kirjasi harjoituksen" 
                :message (:title value) 
                :link (ex-link value)}))

;; submits server messages to all users
(defn submit [type user value]
  (lamina/enqueue message-channel (json/write-str (server-message type user value))))

(defn process-user-message [user json]
  (.info logger (str "user send a message " (class json)))
  (try 
    (let [as-json (json/read-str json)]
      (json/write-str (merge as-json {:user user})))
    (catch Exception e
      (.trace logger (str e ":" json ":" user))
      nil)))

(defn message-handler [user ch]
  (let [user-channel (lamina/filter*
                      identity 
                      (lamina/map* 
                       (partial process-user-message user) 
                       ch))]
    (mapv (partial lamina/enqueue ch) @message-ring)
    (lamina/siphon user-channel message-channel)
    (lamina/siphon message-channel ch)))


(defn connect-message [user ch request]
  (if (:websocket request)
    (message-handler user ch)
    (throw (IllegalStateException. 
            (str user " is attempting non-websocket operation on websocket route on " request)))))

(defroutes async
  (GET "/rest/v1/async" {cookies :cookies}
       (let [user (auth/user-from-cookie cookies)]
         (if (not= "nobody" user)
           (aleph/wrap-aleph-handler (partial connect-message user))
           {:status 200}))))
