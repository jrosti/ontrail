(ns ontrail.mongerfilter
	(:use [monger.operators])
	(:require [clojure.string :as string]
			  [clj-time.core :as time]))

(defn conv-fun [sport-key]
	(if (sport-key #{:distance :duration})
		(fn [val] (Long/valueOf val))
		identity))

(defn or-filter [sport-key catenated-value]
	(let [convert-value (conv-fun sport-key)
		  vals (string/split catenated-value #",")
		  query-fun (fn [val] {sport-key (convert-value val)})]
		(if (> (count vals) 1)
			{$or (vec (map query-fun vals))}
			(query-fun (first vals)))))

(defn to-monger-ltgte [k v]
	(let [op (string/split (name k) #"_")]
		{(str "$" (first op)) 
			{(keyword (second op)) (time/date-time (Integer/valueOf v))}}))

(defn make-date-query [params]
	(if (> (count params) 0)
		{$or (vec (map (partial apply to-monger-ltgte) params))}
		[]))


(defn from [params]
  (let [query-keys (select-keys params [:user :tags :sport :distance :duration])
  		basic-query (vec (map (partial apply or-filter) query-keys))
  		lte-keys (select-keys params [:lte_creationDate :gte_creationDate])
  		lte-query (make-date-query lte-keys)]
  	{$and (vec (concat basic-query lte-query))}))

(defn sortby [params]
	(if-let [sortkey (:sb params)]
		{sortkey -1}
		{:creationDate -1}))