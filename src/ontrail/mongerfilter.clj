
(ns ontrail.mongerfilter
	(:use [monger.operators])
	(:require [clojure.string :as string]))

(defn conv-fun [k]
	(if (k #{:distance :duration})
		(fn [val] (Long/valueOf val))
		identity))

(defn or-filter [k catval]
	(let [cfunk (conv-fun k)
				vals (string/split catval #",")]
		{$or (vec (map (fn [val] {k (cfunk val)}) vals))}))

(defn from [params]
  (let [query (select-keys params [:user :tags :sport :distance :duration])]
  	{$and (vec (map (partial apply or-filter) query))}))

(defn sortby [params]
	(if-let [sortkey (:sb params)]
		{sortkey -1}
		{:creationDate -1}))