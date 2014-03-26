(ns ontrail.mongerfilter
  (:use [monger.operators])
  (:require [clj-time.format :as format]
            [ontrail.group :as group]
            [ontrail.favourite :as favourite]
            [clojure.string :as string]
            [clj-time.core :as time]))

;; Converts query parameters to MongoDB filter. 
;;
;; Example: URL http://ontrail.net/#sport/Juoksu/gte_distance/42195/sb/duration 
;; is mapped to query parameters:
;;  ?sport=Juoksu&gte_distance=42195&sb=duration 
;; and converted to monger query
;; {"$and" [{:sport "Juoksu"} {:distance {"$gte" 42195}}]}

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))
(set! *warn-on-reflection* true)

(def multi-parser (format/formatter (time/default-time-zone)
                                    "dd.MM.yyyy"
                                    "MM.yyyy"
                                    "yyyy"))

(defn parse-date [val] (format/parse multi-parser val))

(defn parse-long [^String val]
  (try
    (Long/valueOf val)
    (catch Exception exception
      (.info logger (str exception " with " val))
      0)))

(defn value-conversion-fun [sport-key]
  (if (sport-key #{:distance :duration})
    (fn [^String val] (Long/valueOf val))
    identity))

(defn or-filter [sport-key catenated-value]
  (let [convert-value (value-conversion-fun sport-key)
        vals (string/split catenated-value #",")
        query-fun (fn [val] {sport-key (convert-value val)})]
    (if (> (count vals) 1)
      {$or (vec (map query-fun vals))}
      (query-fun (first vals)))))

(defn to-monger-range [conv kw val]
  (let [[operator query-key] (string/split (name kw) #"_")]
    {(keyword query-key)
     {(str "$" operator) (conv val)}}))

(defn make-range-query [value-converter params]
  (if (> (count params) 0)
    (vec (map (partial apply (partial to-monger-range value-converter)) params))
    []))

(defn make-basic-query [query-keys]
  (vec (map (partial apply or-filter) query-keys)))

(defn make-group-query 
  ([group-name]
     (make-group-query #(group/find-by-name %) group-name))
  ([group-fn group-name]
     (if-let [group (group-fn group-name)]
       [{$or (vec (map (fn [user] {:user user}) (:users group)))}]
       [])))

(defn make-fav-query [user]
  (if user
    [{$or (vec (map (fn [u] {:user u}) (favourite/favourites-of user)))}]
    []))
  
(defn long-cmp-keys[]
  (vec (for [op ["lte" "gte" "lt" "gt"] qkey ["pace" "distance" "duration" "avghr"]]
         (keyword (str op "_" qkey)))))

(defn make-query-from [params]
  (let [basic-query (make-basic-query (select-keys params [:user :tags :sport :distance :duration]))
        date-range-query (make-range-query parse-date (select-keys params [:lt_creationDate 
                                                                           :gt_creationDate 
                                                                           :lte_creationDate 
                                                                           :gte_creationDate]))
        long-range-query (make-range-query parse-long (select-keys params (long-cmp-keys)))
        group-query (make-group-query (:group params))
        fav-query (make-fav-query (:fav params))
        and-query (vec (concat basic-query date-range-query 
                               long-range-query group-query
                               fav-query))]
    (if (> (count and-query) 0)
      {$and and-query}
      {})))

(defn order-by [^String sort-order]
  (if (.startsWith sort-order "+")
    {(keyword (apply str (rest sort-order))) 1}
    {sort-order -1}))

(defn sortby [params]
  (if-let [sort-order (:sb params)]
    (merge {:lastModifiedDate -1} (order-by sort-order))
    {:creationDate -1 :lastModifiedDate -1}))
