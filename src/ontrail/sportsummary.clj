(ns ontrail.sportsummary
  (:use [ontrail mongodb formats summary])
  (:require [monger.core]
            [monger.conversion]
            [clj-time.core :as time]
            [monger.joda-time]
            [monger.collection :as mc]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn get-overall-summary-cond [user condition]
  (.trace logger (str "Getting summary: " user " condition " condition))  
  (let [cond-with-user (assoc condition :user user)
        all-distinct-sports (mc/distinct EXERCISE "sport" cond-with-user)
        summary-sports (sort-by :numericalDuration > (map #(get-summary (assoc cond-with-user :sport %) :sport %) all-distinct-sports))] 
    {:user user :sports (concat summary-sports [(get-summary cond-with-user :sport "YHTEENSÄ")])}))

(defn get-year-summary-sport [user year]
  (let [first-day (time/date-time year 1 1)
        last-day (time/date-time year 12 31 23 59)
        year-cond {:creationDate {:$gte first-day :$lte last-day}}]
    (assoc (get-overall-summary-cond user year-cond) :year year)))

(defn get-month-summary-sport [user year month]
  (let [first-day (time/date-time year month 1)
        last-day (time/plus (-> first-day (.dayOfMonth) (.withMaximumValue)) (time/hours 23))
        year-month-cond {:creationDate {:$gte first-day :$lte last-day}}]
    (assoc (get-overall-summary-cond user year-month-cond) :year year :month (- month 1))))

(defn get-overall-summary [user]
  (.trace logger (str "Getting overall summary: " user))
  (get-overall-summary-cond user {}))