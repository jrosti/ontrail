(ns ontrail.websocket
  (:use lamina.core
        aleph.http
        compojure.core)
  (:import [java.lang IllegalStateException]))


(defn chat-init [ch]
  (receive-all ch #(println "message: " %)))

(def message-channel (named-channel "messages" chat-init))

(defn chat-handler [ch]
  (siphon ch message-channel)
  (siphon message-channel ch))

(defn chat [ch request]
  (if (:websocket request)
    (chat-handler ch)
    (throw (IllegalStateException. "not reached"))))

(defroutes async
  (GET "/rest/v1/async" {}
       (wrap-aleph-handler chat)))
