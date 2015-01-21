(ns ontrail.keen
  (:import (org.bson.types ObjectId))
  (:require [clojure.string :as string]
            [clojure.data.json :as json]
            [clojure.walk :as walk]
            [clojure.stacktrace :as stacktrace]
            [clojure.core.memoize :as memo]
            [clj-time.format :as fmt]
            [clj-time.core :as time]
            [monger.collection :as mc]
            [clj-http.client :as http])
  (:use [ontrail conf mongodb webutil]
        [clj-http conn-mgr]
        [compojure.core :only (defroutes ANY POST GET PUT DELETE)]))

(def conman
  (make-reusable-conn-manager 
   {:threads 10 :default-per-route 10}))

(def connection
  (merge {:accept :json
          :throw-exceptions false
          :socket-timeout 5000  ;; in milliseconds
          :conn-timeout 120000}
         {:connection-manager conman}))

(def read-key (-> properties :keen :read-key))

(defn url-encode [x]
  (java.net.URLEncoder/encode x))

(defn url-decode [x]
  (java.net.URLDecoder/decode x))

(defn keen-count-uri [by-filter group-by]
  (let [filters-as-str (if by-filter (str "&filters=" (url-encode (json/write-str by-filter))) "")
        group-by-str (if group-by (str "&group_by=" group-by) "")]
    (str
      "https://api.keen.io/3.0/projects/54b1330e96773d221315facf/queries/count?api_key="
      read-key
      "&event_collection=pageviews&timezone=7200" filters-as-str group-by-str)))

(defn count-by-id [id]
  (try
    (let [filter-by [{:property_name :eid :operator :eq :property_value id}]]
      (-> (http/get (keen-count-uri filter-by nil) connection)
          :body
          json/read-str
          walk/keywordize-keys))
    (catch Exception ex
      {:result 0})))

(defn group-by-eid []
  (-> (http/get (keen-count-uri  nil "eid") connection)
      :body
      json/read-str
      walk/keywordize-keys))

(def agents (ref {}))
(def expires (ref {}))

(import java.util.concurrent.Executors)
(set-agent-send-off-executor! (Executors/newFixedThreadPool 8))

(def expires-in (* 10 60 1000))

(defn now [] 
  (System/currentTimeMillis))

(defn get-agent [id]
  (dosync
   (if-let [c (@agents id)]
     c
     (do 
       (alter expires assoc id 0)
       ((alter agents assoc id (count-by-id id)) id)))))

(defn update [state blocking-fn]
  (blocking-fn))

(defn memo-count-by-id [id]
  @(let [agent (get-agent id)]
     (if (< (@expires id) (now))
       (do 
         (dosync (alter expires assoc id (+ expires-in (now))))
         (send-off 
          agent
          update (fn [] (count-by-id id))))
       agent)))

(defn try-get-one [id]
  (try
    (mc/find-one-as-map *db* EXERCISE {:_id (ObjectId. id)})
    (catch Exception exception
      nil)))

(defn keen-to-ex [keen-object]
  (when-let [ex (try-get-one (:eid keen-object))]
    {:title (:title ex)
     :user (:user ex)
     :count (:result keen-object)
     :id (:eid keen-object)
     }))

(defn keen-top[]
  (->> (group-by-eid) :result (sort-by :result) reverse (take 100)))

(defn most-read [_]
  (let [top (keen-top)]
    (->> top
         (map keen-to-ex)
         (filter identity)
         (filter #(not= "admin" (:user %)))
         (map-indexed (fn [i o] (assoc o :index (inc i)))))))

(def memo-most-read (memo/ttl most-read :ttl/threshold (* 12 60 60 1000)))

(defroutes
  keen-routes

  (GET "/rest/v1/keen/most-read" []
       (json-response (memo-most-read nil)))

  (GET "/rest/v1/keen/count/:id" [id]
       (json-response (memo-count-by-id id))))
