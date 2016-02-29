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
        [ontrail.scheduler]
        [ontrail.user])
  (:import [java.lang IllegalStateException]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(def message-buffer-size 100)

;; Ring for in-memory persistence of last messages. 
;; conjoining to end, popping from beginning.
(def message-ring (atom (clojure.lang.PersistentQueue/EMPTY)))


;; user -> last ping epoch
(def last-ping (atom {}))

(def active-user-last-ping-millis 8000)

(defn get-active-users []
  (let [now (System/currentTimeMillis)]
    (keys (into {}
                (filter (fn [entry] (< (- now (last entry)) active-user-last-ping-millis))
                        @last-ping)))))

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
(def broadcast-channel (lamina/named-channel "messages" message-init))

(defn heartbeat []
  (scheduler/schedule-work 
   (fn [] 
     (lamina/enqueue broadcast-channel 
                     (json/write-str {:user "Ontrail" 
                                      :action "sanoi" 
                                      :message (formats/to-human-comment-date (local/local-now))})))
   3600)) ;; seconds

(defn ex-link [ex]
  (str "ex/" 
       (if-let [id (:id ex)] 
         id 
         (:_id ex))))

(defn server-message [type user value]
  (condp = type
    :comment-ex {:user user
                 :avatar (get-avatar-url user)
                 :action (str "kommentoi käyttäjän " (:user value) " harjoitusta")
                 :otherUser (:user value)
                 :message (:title value) 
                 :link (ex-link value)}
    :create-ex {:user user
                :avatar (get-avatar-url user)
                :action "kirjasi harjoituksen"
                :message (:title value) 
                :link (ex-link value)}))

;; submits server messages to all users
(defn submit [type user value]
  (lamina/enqueue broadcast-channel (json/write-str (server-message type user value))))

(defn process-user-message [user json]
  (.trace logger (str "user sent a message " (class json)))
  (try 
    (let [as-json (json/read-str json)]
      (if (= (as-json "action") "server")
        nil
        (json/write-str (merge as-json {:user user}))))
    (catch Exception e
      (.trace logger (str "process user message ") e)
      nil)))

(defn to-server-channel [user json]
  (try 
    (let [as-json (json/read-str json)]
      (if (not= (as-json "action") "server")
        nil
        (condp = (as-json "message")
          "ping" (do (.trace logger (str "ping by " user))
                     (swap! last-ping assoc user (System/currentTimeMillis))
                     (json/write-str {:action "server" :message "pong"}))
          "/who" (do 
                   (.info logger (str "/who by " user))
                   (json/write-str {:user "Ontrail" 
                                    :action "sanoi"
                                    :message (str "Käyttäjät: " 
                                                  (apply str (interpose ", " (get-active-users))))}))
          nil)))
    (catch Exception e
      (.trace logger (str "process user message ") e)
      nil)))

(defn message-handler [user ch]
  (let [server-channel (lamina/filter* 
                        identity
                        (lamina/map*
                         (partial to-server-channel user)
                         ch))
        user-channel (lamina/filter*
                      identity 
                      (lamina/map* 
                       (partial process-user-message user) 
                       ch))]
    (mapv (partial lamina/enqueue ch) @message-ring)
    (lamina/siphon server-channel ch)
    (lamina/siphon user-channel broadcast-channel)
    (lamina/siphon broadcast-channel ch)))

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
