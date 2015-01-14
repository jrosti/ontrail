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
  (make-reusable-conn-manager {:timeout 10 :threads 10 :default-per-route 10}))

(def connection
  (merge {:accept :json}
         {:throw-exceptions false}
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
  (let [filter-by [{:property_name :eid :operator :eq :property_value id}]]
    (-> (http/get (keen-count-uri filter-by nil) connection)
         :body
         json/read-str
         walk/keywordize-keys)))

(defn group-by-eid []
  (-> (http/get (keen-count-uri  nil "eid") connection)
      :body
      json/read-str
      walk/keywordize-keys))

(def memo-count-by-id
  (memo/ttl count-by-id :ttl/threshold (* 10 60 1000)))

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

(def memo-most-read (memo/ttl most-read :ttl/threshold (* 6 60 60 1000)))

(defroutes
  keen-routes

  (GET "/rest/v1/keen/most-read" []
       (json-response (memo-most-read nil)))

  (GET "/rest/v1/keen/count/:id" [id]
       (json-response (memo-count-by-id id))))
