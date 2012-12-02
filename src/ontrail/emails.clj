(ns ontrail.emails
  (:require [postal.core :as postal]
            [clojure.stacktrace :as stacktrace]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(def admin "jari.rosti@gmail.com")

(defn import-message [user fres]
  {:from "ontrail@ontrail.net"
   :to [admin]
   :subject (str "Lenkkivihko-harjoituspäiväkirjan tuonti käyttäjälle " user)
   :body (str fres)})

(defn send-import-msg [user fres]
  (try
    (postal/send-message (import-message user fres))
    (catch Exception exception
       (.error logger (str exception))
       (stacktrace/print-stack-trace exception 100)
       nil)))