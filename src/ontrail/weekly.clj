(ns ontrail.weekly
  (:use [ontrail mongodb formats exercise formats]
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

(defn get-entry [coll kw]
  (if (and (contains? coll kw) (not= nil (kw coll)) (number? (kw coll)))
    (kw coll)
    0))

(defn accumulate [kw totals result]
  {:sport kw :distance (+ (:distance totals) (get-entry result :distance))
   :duration (+ (:duration totals) (get-entry result :duration))})

(defn humanize [coll]
  (assoc coll :distance (to-human-distance (:distance coll)) :duration (to-human-time (:duration coll))))

(defn weekly-sums [results]
  (if (>= (count results) 1) 
    (let [kw-all (keyword "Kaikki")
          all (humanize (reduce (partial accumulate kw-all) (cons {:sport kw-all :distance 0 :duration 0} results)))]        
      (cons all []))
    [{}]))

(defn interval-as-exlist [user week-interval]
    (let [start (.getStart week-interval) end (.getEnd week-interval)
          results (interval-query user start end)]                    
      {:week (week-number week-interval)
       :from start
       :summary (weekly-sums results)
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
                           