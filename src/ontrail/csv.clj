(ns ontrail.csv
  (:use [ontrail mongodb mongerfilter])
  (:require [monger.collection :as mc]
            [monger.query :as mq]
            [monger.result :as mr]
            [clojure.string :as string]
            [clj-time.core :as time]
            [monger.joda-time]))


(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn exs [query]
  (mq/with-collection EXERCISE 
    (mq/find query)
    (mq/sort {:creationDate 1})))

(defn csv-escape [field]
  (let [s (str field)]
    (str "\"" (string/replace s "\"" "\"\"") "\"")))

(defn to-csv-date [datetime]
  (str (time/year datetime) "-" (time/month datetime) "-" (time/day datetime)))


(defn join-with [separator elements] 
  (reduce (fn [a b] (str a separator b)) elements))

(defn as-link [mid]
  (str "http://ontrail.net/#ex/" mid))

(def extract-fields
  (apply juxt (mapv #(comp csv-escape %) 
                    [(comp to-csv-date :creationDate) 
                     :title 
                     :sport 
                     :distance 
                     :duration 
                     :pace
                     (comp as-link :_id)])))

(def ex-filter 
  {:creationDate {"$gte" (time/date-time 2013 1 1)}})

(defn to-csv [exs] 
  (join-with "\r\n" (map (partial join-with ",") (map extract-fields exs))))

(defn export [params]
  (.info logger (str "Exporting csv " params))
  (if-let [user (:user params)]
    (to-csv (exs (assoc ex-filter :user user)))
    ""))
