(ns ontrail.weekly
  (:use [ontrail mongodb formats exercise]
        monger.operators)
  (:require [monger.core]
            [monger.conversion]
            [clj-time.core :as time]
            [monger.collection :as mc]
            [monger.query :as mq]
            [clojure.string :as string]
            [monger.joda-time]))

(defn week-number [week]
  (.get (.weekOfWeekyear (.getStart week))))

(defn to-week-day-idx [date]
  (- (time/day-of-week date) 1))

(defn to-week-day [date]
  (["maanantai" "tiistai" "keskiviikko" "torstai" "perjantai" "lauantai" "sunnuntai"]
     (to-week-day-idx date)))

(defn simple-result [exercise]
  (let [id (str (:_id exercise))
        user (:user exercise)
        user-profile (:profile (mc/find-one-as-map ONUSER {:username user}))
        heart-rate-reserve (get-heart-rate-reserve exercise user-profile)
        distance (to-human-distance (:distance exercise))
        creation-date (:creationDate exercise)]        
    {:id id
     :distance distance
     :title (:title exercise)
     :tags (:tags exercise)
     :sport (:sport exercise)
     :isoDate (:creationDate exercise)
     :dayIndex (to-week-day-idx creation-date)
     :date (to-human-date creation-date)
     :duration (to-human-time (:duration exercise))
     :day (to-week-day creation-date)
     :avghr (:avghr exercise)
     :hrReserve heart-rate-reserve
     :pace (get-pace exercise)})) 

(defn week-period [dt]
  (let [midnight (time/date-time (time/year dt) (time/month dt) (time/day dt))
        dow (time/day-of-week midnight)
        week-starts (time/minus midnight (time/days (- dow 1)))
        week-stops (time/plus midnight (time/days (- 8 dow)))]
    (time/interval week-starts week-stops)))

(defn interval-query [user start end]
  (mq/with-collection EXERCISE
    (mq/find {:user user :creationDate {:$gte start :$lte end}})
    (mq/sort {:lastModifiedDate 1})))

(defn accumulate [totals result]
  (let [get-entry #(if (contains? %1 %2) (%1 %2) 0)
        acc #(+ (get-entry totals %1) (get-entry result %2))
        kw-all-distance (keyword "distance_Kaikki")
        kw-all-duration (keyword "duration_Kaikki")
        kw-sport-distance (keyword (str "distance_" (:sport result)))
        kw-sport-duration (keyword (str "duration_" (:sport result)))]
    (assoc totals
      kw-all-duration (acc kw-all-duration :duration)
      kw-all-distance (acc kw-all-distance :distance)
      kw-sport-distance (acc kw-sport-distance :distance)
      kw-sport-duration (acc kw-sport-duration :duration))))

(defn to-array [sum] nil)

(defn weekly-sums [results]
  (if (>= (count results) 1) 
    (reduce accumulate (cons {} results))
    {}))

(defn interval-as-exlist [user week-interval]
    (let [start (.getStart week-interval) end (.getEnd week-interval)
          results (interval-query user start end)]                    
      {:week (week-number week-interval)
       :from (to-human-date start) :to (to-human-date (time/minus end (time/days 1)))
       :sums (weekly-sums results)
       :exs (map simple-result results)}))
       
(defn weeks-from [date-time]
  (cons (week-period date-time) (lazy-seq (weeks-from (time/plus date-time (time/days 7))))))

(defn week-intervals [year month]
  (let [first-day (time/date-time year month 1)
        last-day (-> first-day (.dayOfMonth) (.withMaximumValue))]
    (for [week (weeks-from first-day) :while (not (time/after? (.getStart week) last-day))]
      week)))
  
(defn generate-month [user year month]
  (reverse (map (partial interval-as-exlist user) (week-intervals year month))))

(defn weekly-wrapper [params]
  {})
                           