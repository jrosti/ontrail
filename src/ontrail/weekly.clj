(ns ontrail.weekly
  (:use [ontrail mongodb formats])
  (:require [monger.core]
            [monger.conversion]
            [clj-time.core :as time]
            [monger.joda-time]
            [monger.collection :as mc]))

(defn week-period [dt]
  (let [midnight (time/date-time (time/year dt) (time/month dt) (time/day dt))
        dow (time/day-of-week midnight)
        week-starts (time/minus midnight (time/days (- dow 1)))
        week-stops (time/plus midnight (time/days (- 8 dow)))]
    (time/interval week-starts week-stops)))

(defn recur-weeks [args &] nil)

(defn summary-weeks [user start-date stop-date]
  (let [first-week (week-period start-date)
        last-week (week-period stop-date)
        distinct-sports (mc/distinct EXERCISE "sport" {:user user :creationDate {:$gte (.getStart first-week) :$lte (.getEnd last-week)}})]
    {:header distinct-sports :weeks (recur-weeks user first-week last-week distinct-sports)}))

(defn weekly-wrapper [params]
  {})
                           