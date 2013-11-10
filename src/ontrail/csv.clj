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
      
(def extract-fields
  (apply juxt (mapv #(comp csv-escape %) 
                    [(comp to-csv-date :creationDate) 
                     :title 
                     :sport 
                     :distance 
                     :duration 
                     :pace
                     :avghr
                     (comp as-link :_id)
                     (comp to-human-distance :distance)
                     (comp to-human-time :duration)
                     get-pace
                     tags])))

(defn ex-filter [year user]
  {"$and" [{:creationDate {"$gte" (time/date-time year 1 1)}} {:creationDate {"$lt" (time/date-time (inc year) 1 1)}} {:user user}]})

(defn to-csv [exs] 
  (str
   "date,title,sport,distance,duration,pace,avghr,url,distancetext,durationtext,pacetext,tags\r\n"
   (join-with "\r\n" (map (partial join-with ",") (map extract-fields exs)))))

(defn export [params]
  (.info logger (str "Exporting csv " params))
  (if-let [user (:user params)]
    (let [year (if (:year params) (Integer/valueOf (:year params)) (time/year (time/now)))]
      (to-csv (exs (ex-filter year user))))
    ""))
