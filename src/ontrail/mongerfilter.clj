
(ns ontrail.mongerfilter
	(:use [monger.operators])
	(:require [clojure.string :as string]))

(defn or-filter [k catval]
	(let [vals (string/split catval #",")]
		{$or (vec (map (fn [val] {k val}) vals))}))

(defn from [params]
  (let [query (select-keys params [:user :tags :sport])]
  	{$and (vec (map (partial apply or-filter) query))}))