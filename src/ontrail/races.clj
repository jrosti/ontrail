(ns ontrail.races
  (:use [ontrail mongodb sportsummary])
  (:require 
   [monger.collection :as mc]
   [monger.query :as mq]
   [clojure.core.memoize :as memo]
   [monger.joda-time]))


(defn users []
  (->> (mc/find-maps *db* "onuser" {})
       (map :username)))

(def users-memo 
  (memo/ttl users :ttl/threshold (* 24 60 60 1000)))

(defn total [sport-key]
  (fn [year user]
    (let [summary (get-year-summary-sport user year)
          sports-with-combined (concat (get-combined-sports (:sports summary)) (:sports summary))]
      (->> sports-with-combined
           (filter (fn [e] (= sport-key (:sport e))))
           first))))

(defn totals-by [total-fn sort-key year]
  (->> (users-memo)
       (map (fn [u]
              (when-let [t (total-fn year u)]
                (assoc (select-keys t [:pace :nduration :repeats :ndistance :duration :distance :count]) :user u))))
       (sort-by sort-key)
       (filter :nduration)
       (filter #(> (:nduration %) 0))
       reverse
       (map-indexed (fn [i e] (assoc e :position (inc i))))))

(defn totals-all [year]
  (totals-by (total "YHTEENSÄ") :nduration year))

(def sort-keys
  {"Leuanveto" :repeats})

(defn totals-by-sport [sport year]
  (totals-by (total sport) (sort-keys sport :ndistance) year))
