(ns ontrail.races
  (:use [ontrail mongodb sportsummary])
  (:require 
   [monger.collection :as mc]
   [monger.query :as mq]
   [ontrail.parser :as parser]
   [clojure.core.memoize :as memo]
   [monger.joda-time]))


(defn users []
  (->> (mc/find-maps *db* "onuser" {})
       (map :username)))

(def users-memo 
  (memo/ttl users :ttl/threshold (* 24 60 60 1000)))

(defn total [sport-key]
  (fn [year user]
    (->> (get-year-summary-sport user year)
         :sports
         (filter (fn [e] (= sport-key (:sport e))))
         first)))

(defn totals-by [total-fn sort-key year]
  (->> (users-memo)
       (map (fn [u]
              (when-let [t (total-fn year u)]
                (assoc (select-keys t [:pace :numericalDuration :numDistance :duration :distance :count]) :user u))))
       (sort-by sort-key)
       (filter :numericalDuration)
       (filter #(> (:numericalDuration %) 0))
       reverse
       (map-indexed (fn [i e] (assoc e :position (inc i))))))

(defn totals-all [year]
  (totals-by (total "YHTEENSÄ") :numericalDuration year))

(defn totals-running [year]
  (totals-by (total "Juoksu") :numDistance year))

(defn totals-swimming [year]
  (totals-by (total "Uinti") :numericalDuration year))
