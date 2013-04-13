(ns ontrail.mongerfilter
	(:use [monger.operators])
	(:require 	[clj-time.format :as format]
				[clojure.string :as string]
			  	[clj-time.core :as time]))

(def multi-parser (format/formatter (time/default-time-zone)
                                    "dd.MM.yyyy"
                                    "MM.yyyy"
                                    "yyyy"))

(defn parse-date [val] (format/parse multi-parser val))

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

(defn to-monger-range [f k v]
	(let [op (string/split (name k) #"_")]
		{(keyword (second op))
			{(str "$" (first op)) (f v)}}))

(defn make-range-query [value-converter params]
	(if (> (count params) 0)
		(vec (map (partial apply (partial to-monger-range value-converter)) params))
		[]))

(defn make-basic-query [query-keys]
	(vec (map (partial apply or-filter) query-keys)))

(defn make-query-from [params]
  (let [basic-query (make-basic-query (select-keys params [:user :tags :sport :distance :duration]))
  		date-range-query (make-range-query parse-date (select-keys params [:lte_creationDate :gte_creationDate]))]
  	{$and (vec (concat basic-query date-range-query))}))

(defn sortby [params]
	(if-let [sortkey (:sb params)]
		{sortkey -1}
		{:creationDate -1}))