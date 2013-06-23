(ns ontrail.mongerfilter
	(:use [monger.operators])
	(:require 	[clj-time.format :as format]
				[ontrail.group :as group]
				[clojure.string :as string]
			  	[clj-time.core :as time]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(def multi-parser (format/formatter (time/default-time-zone)
                                    "dd.MM.yyyy"
                                    "MM.yyyy"
                                    "yyyy"))

(defn parse-date [val] (format/parse multi-parser val))

(defn parse-long [val]
    (try
      (Long/valueOf val)
    (catch Exception exception
      (.info logger (str exception " with " val))
      0)))

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

(defn make-group-query [group-name]
	(if-let [group (group/find-by-name group-name)]
		[{$or (vec (map (fn [user] {:user user}) (:users group)))}]
		[]))

(defn long-cmp-keys[]
	(vec (for [op ["lte" "gte" "lt" "gt"] qkey ["pace" "distance" "duration" "avghr"]]
		(keyword (str op "_" qkey)))))

(defn make-query-from [params]
  (let [basic-query (make-basic-query (select-keys params [:user :tags :sport :distance :duration]))
  		date-range-query (make-range-query parse-date (select-keys params [:lt_creationDate :gt_creationDate :lte_creationDate :gte_creationDate]))
  		long-range-query (make-range-query parse-long (select-keys params (long-cmp-keys)))
  		group-query (make-group-query (:group params))
  		and-query (vec (concat basic-query date-range-query long-range-query group-query))]
  	(if (> (count and-query) 0)
  		{$and and-query}
  		{})))

(defn sortby [params]
	(if-let [sortkey (:sb params)]
		{sortkey -1}
		{:creationDate -1}))