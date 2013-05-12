(ns ontrail.sportsummary
  (:use [ontrail mongodb formats summary])
  (:require [monger.core]
            [monger.conversion]
            [clj-time.core :as time]
            [monger.joda-time]
            [monger.collection :as mc]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(def summary-memos (ref {}))

(defn get-overall-summary-cond [user condition]
  (let [cond-with-user (assoc condition :user user)
        all-distinct-sports (mc/distinct EXERCISE "sport" cond-with-user)
        summary-sports (sort-by :numericalDuration > (map #(get-summary (assoc cond-with-user :sport %) :sport %) all-distinct-sports))]
    (if (> (count summary-sports) 1) 
      {:user user :sports (concat summary-sports [(get-summary cond-with-user :sport "YHTEENSÄ")])}
      {:user user :sports summary-sports})))

(defn memo-for [user]
  (if-let [summary-memo (@summary-memos user)]
    summary-memo
    (let [new-memo (memoize (partial get-overall-summary-cond user))]
      (alter summary-memos assoc user new-memo)
      new-memo)))

(defn get-year-summary-sport [user year]
  (dosync (let [first-day (time/date-time year 1 1)
                last-day (time/date-time year 12 31 23 59)
                year-cond {:creationDate {:$gte first-day :$lte last-day}}
                summary-memo (memo-for user)]
    (assoc (summary-memo year-cond) :year year))))

(defn get-month-summary-sport [user year month]
  (dosync (let [first-day (time/date-time year month 1)
                last-day (time/plus (-> first-day (.dayOfMonth) (.withMaximumValue)) (time/hours 23))
                year-month-cond {:creationDate {:$gte first-day :$lte last-day}}
                summary-memo (memo-for user)]
    (assoc (summary-memo year-month-cond) :year year :month (- month 1)))))

(defn get-overall-summary [user]
  (dosync (let [summary-memo (memo-for user)]
    (summary-memo {}))))

(defn reset-memo-for [user]
  (dosync (alter summary-memos dissoc user))
  (future get-overall-summary user)
  nil)
