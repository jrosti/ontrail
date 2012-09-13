(ns ontrail.log
  (:require [clj-time.local :as lt]))

(defn to-logline [req]
  (str (get req :request-method) " "  (get req :remote-addr) " " (get req :uri)))
