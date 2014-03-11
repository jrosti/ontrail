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

(def message-buffer-size 30)

(def message-ring (atom (clojure.lang.PersistentQueue/EMPTY)))

(defn message-init [ch]
  (lamina/receive-all 
   ch
   (fn [message]
     (.info logger (str "chat message: " message))
     (swap! message-ring conj message)
     (if (> (count @message-ring) message-buffer-size)
       (swap! message-ring pop)))))

(def message-channel (lamina/named-channel "messages" message-init))

(def heartbeat 
  (scheduler/schedule-work 
   (fn [] 
     (lamina/enqueue message-channel 
                     (json/write-str {:user "Ontrail" 
                                      :action "sanoi" 
                                      :message (formats/to-human-comment-date (local/local-now))})))
   3600)) ;; seconds

(defn process-user-message [user json]
  (try 
    (let [as-json (json/read-str json)]
      (json/write-str (merge as-json {:user user})))
    (catch Exception e
      (.error logger (str e ":" json ":"))
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
    :comment-ex {:user user 
                 :action (str "kommentoi käyttäjän " (:user value) " harjoitusta") 
                 :message (:title value) 
                 :link (ex-link value)}
    :create-ex {:user user 
                :action "kirjasi harjoituksen" 
                :message (:title value) 
                :link (ex-link value)}))

(defn submit [type user value]
  (lamina/enqueue message-channel (json/write-str (server-message type user value))))
