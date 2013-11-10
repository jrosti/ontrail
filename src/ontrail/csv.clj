(ns ontrail.csv
  (:use [ontrail mongodb formats])
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
    (mq/sort {:creationDate 1})
    (mq/batch-size 1000)))

(defn csv-escape [field]
  (let [s (str field)]
    (str "\"" (string/replace s "\"" "\"\"") "\"")))

(defn to-csv-date [datetime]
  (str (time/year datetime) "-" (time/month datetime) "-" (time/day datetime)))


(defn join-with [separator elements] 
  (reduce (fn [a b] (str a separator b)) elements))

(defn as-link [mid]
  (str "http://ontrail.net/#ex/" mid))

(defn tags [ex]
  (if-let [tags (:tags ex)]
    (if (> (count tags) 1)
      (join-with ";" tags)
      (first tags))
    ""))

(def extract-funs
  {"date" (comp to-csv-date :creationDate) 
   "title" :title 
   "sport" :sport 
   "distance" :distance 
   "duration" :duration 
   "pace" :pace
   "avghr" :avghr
   "url" (comp as-link :_id)
   "distancetext" (comp to-human-distance :distance)
   "durationtext" (comp to-human-time :duration)
   "pacetext" get-pace
   "tags" tags})

(def default-keys
  ["date" "title" "sport" "distance" "duration" "pace" "avghr" "url" "distancetext" "durationtext" "pacetext" "tags"])

(defn extract-fields [keys]
  (apply juxt (mapv #(comp csv-escape %) 
                    (mapv (partial get extract-funs) keys))))

(defn ex-filter [year user]
  {"$and" [{:creationDate {"$gte" (time/date-time year 1 1)}} {:creationDate {"$lt" (time/date-time (inc year) 1 1)}} {:user user}]})

(defn to-csv [keys exs] 
  (str
   (join-with "," keys) "\r\n"
   (join-with "\r\n" (map (partial join-with ",") (map (extract-fields keys) exs)))))

(defn export [params]
  (.info logger (str "Exporting csv " params))
  (if-let [user (:user params)]
    (let [keys (if (:format params) (string/split (:format params) #",") default-keys)
          year (if (:year params) (Integer/valueOf (:year params)) (time/year (time/now)))]
      (to-csv keys (exs (ex-filter year user))))
    ""))
