(ns ontrail.weekly
  (:use [ontrail mongodb formats exercise]
        monger.operators)
  (:require [monger.core]
            [monger.conversion]
            [clj-time.core :as time]
            [clj-time.format :as format]
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

(defn sport-id [sport]
  (string/replace sport #"[^a-z09A-Z]+" "_"))

(defn to-stats-pace [pace] 
 (if (> (count pace) 0) (string/replace pace #" min/km" "/km") nil))

(defn to-human-stats-duration [duration]
  (try 
    (let [minutes (mod (int (/ duration 6000)) 60)
          hours (int (/ duration 360000))]
      (format "%02d:%02d" hours minutes))
    (catch Exception e "")))

(defn simple-result [exercise]
  (let [id (str (:_id exercise))
        user (:user exercise)
        user-profile (:profile (mc/find-one-as-map *db* ONUSER {:username user}))
        heart-rate-reserve (get-heart-rate-reserve exercise user-profile)
        distance (to-human-distance (:distance exercise))
        creation-date (:creationDate exercise)
        pace  (get-pace exercise)]        
    {:id id
     :distance distance
     :title (:title exercise)
     :tags (:tags exercise)
     :sport (:sport exercise)
     :sportId (sport-id (:sport exercise))
     :isoDate (:creationDate exercise)
     :dayIndex (to-week-day-idx creation-date)
     :date (to-human-date creation-date)
     :duration (to-human-time (:duration exercise))
     :day (to-week-day creation-date)
     :avghr (:avghr exercise)
     :hrReserve heart-rate-reserve
     :pace pace
     :repeats (:detailRepeats exercise)
     :elevation (:detailElevation exercise)
     :statspace (to-stats-pace pace)
     :statsduration (to-human-stats-duration (:duration exercise))
     })) 

(defn week-period [dt]
  (let [midnight (time/date-time (time/year dt) (time/month dt) (time/day dt))
        dow (time/day-of-week midnight)
        week-starts (time/minus midnight (time/days (- dow 1)))
        week-stops (time/minus (time/plus midnight (time/days (- 8 dow))) (time/hours 5))]
    (time/interval week-starts week-stops)))

(defn interval-query [user start end]
  (mq/with-collection *db* EXERCISE
    (mq/find {:user user :creationDate {:$gte start :$lte end}})
    (mq/sort {:lastModifiedDate 1})))

(defn get-entry [coll kw]
  (if (and (contains? coll kw) (not= nil (kw coll)) (number? (kw coll)))
    (kw coll)
    0))

(defn accumulate [sport totals result]
  (let [distance (get-entry result :distance)
        true-duration (if (> distance 0) (get-entry result :duration) 0)]
  {:sportId (sport-id sport) 
   :sport sport 
   :distance (+ (:distance totals) (get-entry result :distance))
   :duration (+ (:duration totals) (get-entry result :duration))
   :tduration (+ (:tduration totals) true-duration)}))

(defn accumulate-if-sport-is [sport totals result]
  (if (= sport (:sport result))
    (accumulate sport totals result)
    totals))

(defn humanize [coll]
  (let [pace (get-pace (assoc coll :duration (:tduration coll)))
        statspace (to-stats-pace pace)]
    (assoc coll 
      :statspace statspace 
      :pace (string/replace pace #" " "")
      :tdistance (:distance coll)
      :distance (string/replace (to-human-distance (:distance coll))
      #" " "")
      :duration (to-human-time (:duration coll))
      :tduration (:duration coll)
      :statsduration (to-human-stats-duration (:duration coll)))))

(defn zero-result[sport] {:sport sport :distance 0 :duration 0 :tduration 0})

(defn summary-distinct-sports [results]
  (let [sports-distinct (filter (partial not= "Muu merkintä") (distinct (map :sport results)))]
    (map humanize (sort-by :duration >
                           (for [sport sports-distinct]
                             (reduce (partial accumulate-if-sport-is sport)
                                     (cons (zero-result sport) results)))))))

(defn weekly-sums [results]
  (let [sport-all "Kaikki"
        summary-all (assoc (humanize (reduce (partial accumulate sport-all)
                                      (cons (zero-result sport-all) results)))
                      :total true)]        
    (cons summary-all (summary-distinct-sports results))))

(def date-formatter (format/formatter "dd.MM.yyyy"))
(def format-week-date (partial format/unparse date-formatter))

(defn interval-as-exlist [user week-interval]
    (let [start (.getStart week-interval) end (.getEnd week-interval)
          results (interval-query user start end)]                    
      {:user user
       :week (week-number week-interval)
       :from (format-week-date start)
       :to (format-week-date end)
       :summary (weekly-sums results)
       :exs (sort-by :dayIndex (map simple-result results))}))
       
(defn weeks-from [date-time]
  (cons (week-period date-time) (lazy-seq (weeks-from (time/plus date-time (time/days 7))))))

(defn week-intervals [first-day last-day]
  (for [week (weeks-from first-day) :while (not (time/after? (.getStart week) last-day))]
    week))

(defn month-interval [year month]
  (let [first-day (time/date-time year month 1)
        last-day (-> first-day (.dayOfMonth) (.withMaximumValue))]
    (week-intervals first-day last-day)))

(defn generate-year [user year]
  (let [first-day (time/date-time year 1 1)
        last-day (time/date-time year 12 31)]
    (drop-last (map (partial interval-as-exlist user) (week-intervals first-day last-day)))))

(defn generate-month [user year month]
  (reverse (map (partial interval-as-exlist user) (month-interval year month))))

(defn weekly-wrapper [params]
  {})
                           
