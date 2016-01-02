(ns ontrail.sportsummary
  (:use [ontrail mongodb formats summary])
  (:require [monger.core]
            [monger.conversion]
            [clj-time.core :as time]
            [monger.joda-time]
            [monger.collection :as mc]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(def summary-memos (ref {}))

(defn get-distinct-tags [condition]
  (filter (partial not= nil) (mc/distinct *db* EXERCISE "tags" condition)))

(def by-foot-sports #{"Juoksu" "Kävely" "Suunnistus" "Rogaining" "Maastojuoksu" "Vaellus" "Sauvakävely"})
(def by-wheel-sports #{"Pyöräily" "Maastopyöräily" "Maantiepyöräily" "Kickbike" "Cyclocross"}) 

(defn plus [key sports]
  (apply + (map #(if-let [v (% key)] v 0.0) sports)))

(defn sport-sum [sports]
  (let [total (apply + (map :count sports))]
    {
     :nduration (plus :nduration sports)
     :tduration (plus :tduration sports)
     :tdistance (plus :tdistance sports)
     :ndistance (plus :ndistance sports)
     :elevation (plus :elevation sports)
     :count total }))

(defn humanize [sport]
  (merge 
   {:duration (to-human-time (:nduration sport))
    :distance (to-human-distance (:ndistance sport))
    :pace (get-pace {:sport (:sport sport) :duration (:tduration sport) :distance (:tdistance sport)})
    :elevation (when (> (:elevation sport) 0))
    :avghr nil}
   sport))


(defn combined [summary-sports sport-set combined-name]
  (let [sports (filter #(sport-set (:sport %)) summary-sports)
        summary-item (assoc (sport-sum sports) :sport combined-name :combined true)]
    (humanize summary-item)))

(defn get-combined-sports [summary-sports]
  (->> 
   [(combined summary-sports by-foot-sports "Byfoot")
    (combined summary-sports by-wheel-sports "Bywheel")]
   (filter #(> (:count %) 0))))
  
(defn get-overall-summary-cond [user condition]
  (let [cond-with-user (assoc condition :user user)
        all-distinct-sports (mc/distinct *db* EXERCISE "sport" cond-with-user)
        summary-sports (sort-by :nduration > (map #(get-summary (assoc cond-with-user :sport %) :sport %) all-distinct-sports))]
    (if (> (count summary-sports) 0) 
      {:user user :sports (concat
                           summary-sports
                           [(get-summary (assoc cond-with-user :sport {"$nin" ["Sairaus" "Hieronta" "Tapahtuma"]}) :sport "YHTEENSÄ")])}
      {:user user :sports summary-sports})))

(defn get-overall-tags-cond [user condition]
  (.trace logger (str "Getting summary: " user " condition " condition))  
  (let [cond-with-user (assoc condition :user user)
        all-distinct-tags (filter (partial not= "") (get-distinct-tags cond-with-user))
        summary-tags (sort-by :numericalDuration > 
          (map #(get-summary (assoc cond-with-user :tags %) :tag %) all-distinct-tags))]
    {:user user :sports summary-tags}))

(defn memo-for-with [with-f user]
  (if-let [summary-memo (@summary-memos {:u user :f with-f})]
    summary-memo
    (let [new-memo (memoize (partial with-f user))]
      (alter summary-memos assoc {:u user :f with-f} new-memo)
      new-memo)))

(def memo-for (partial memo-for-with get-overall-summary-cond))

(def tagmemo-for (partial memo-for-with get-overall-tags-cond))

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

;; Tag summaries

(defn get-month-summary-tags [user year month]
  (dosync (let [first-day (time/date-time year month 1)
                last-day (time/plus (-> first-day (.dayOfMonth) (.withMaximumValue)) (time/hours 23))
                year-month-cond {:creationDate {:$gte first-day :$lte last-day}}
                summary-memo (tagmemo-for user)]
            (assoc (summary-memo year-month-cond) :year year :month (- month 1)))))

(defn get-year-summary-tags [user year]
  (dosync (let [first-day (time/date-time year 1 1)
                last-day (time/date-time year 12 31 23 59)
                year-cond {:creationDate {:$gte first-day :$lte last-day}}
                summary-memo (tagmemo-for user)]
            (assoc (summary-memo year-cond) :year year))))
  
(defn get-overall-tags-summary [user]
  (dosync (let [summary-memo (tagmemo-for user)]
            (summary-memo {}))))

;; reset and update memoizations
  
(defn do-month [user year month]
  (doall (get-month-summary-sport user year month)))

(defn memoizes-after-reset [user]
  (let [now (time/now)
        year (time/year now)
        up-to-month (+ 2 (time/month now))]
    (.trace logger (str "memoizing after reset for: " user))
    (doall (get-overall-summary user))
    (doall (get-overall-tags-summary user))
    (doall (get-year-summary-sport user year))
    (doall (get-year-summary-sport user (- year 1)))
    (doall (map (partial do-month user year) (range 1 up-to-month))))
  nil)

(defn reset-memo-for [user]
  (dosync (alter summary-memos dissoc {:u user :f get-overall-summary-cond}))
  (dosync (alter summary-memos dissoc {:u user :f get-overall-tags-cond}))
  (future (memoizes-after-reset user)))
