(ns ontrail.tagsummary
  (:use [ontrail mongodb formats summary])
  (:require [monger.core]
            [monger.conversion]
            [clj-time.core :as time]
            [monger.joda-time]
            [monger.collection :as mc]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

;;; copy-paste from sport summary. 

(defn get-distinct-tags [condition]
  (filter (partial not= nil) (mc/distinct EXERCISE "tags" condition)))

(defn get-overall-tags-cond [user condition]
  (.trace logger (str "Getting summary: " user " condition " condition))  
  (let [cond-with-user (assoc condition :user user)
        all-distinct-tags (filter (partial not= "") (get-distinct-tags cond-with-user))
        summary-tags (sort-by :numericalDuration > 
          (map #(get-summary (assoc cond-with-user :tags %) :tag %) all-distinct-tags))]
    {:user user :sports summary-tags}))

(defn get-month-summary-tags [user year month]
  (let [first-day (time/date-time year month 1)
        last-day (time/plus (-> first-day (.dayOfMonth) (.withMaximumValue)) (time/hours 23))
        year-month-cond {:creationDate {:$gte first-day :$lte last-day}}]
    (assoc (get-overall-tags-cond user year-month-cond) :year year :month (- month 1))))

(defn get-year-summary-tags [user year]
  (let [first-day (time/date-time year 1 1)
        last-day (time/date-time year 12 31 23 59)
        year-cond {:creationDate {:$gte first-day :$lte last-day}}]
    (assoc (get-overall-tags-cond user year-cond) :year year)))

(defn get-overall-tags-summary [user]
  (let [tags (filter (partial not= "") (get-distinct-tags {:user user}))]
    {:user user :sports (sort-by :numericalDuration > 
      (map #(get-summary {:user user :tags %} :tag %) tags)) }))
