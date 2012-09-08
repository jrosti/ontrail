(ns ontrail.search
  (:use [ontrail mongodb utils log exercise])
  (:require [monger.collection :as mc]
            [monger.query :as mq]
            [monger.result :as mr]
            [clojure.string :as string])
  (:import [org.bson.types ObjectId]))

(defn get-terms [exercise]
  (let [part #(get exercise %)
        words (.toLowerCase (str (part :body) " " (part :title)))
        clean-words (string/replace (strip-html words) #"[^a-zåäö]+" " ")
        bare-term-list (string/split clean-words #" +")]
    (filter #(> (count %) 3) bare-term-list))) ;; search terms must contain more than three letters

(defn insert-term [ex-id term]
  (let [idx (mc/find-one-as-map "exerciseIndex" {:_id term})]
    (if (mr/ok? (if (= nil idx)
                  (mc/insert "exerciseIndex" {:_id term :p (list ex-id)})
                  (mc/update "exerciseIndex" {:_id term} {:p (cons ex-id (get idx :p))})))
      1
      0)))
  

(defn insert-exercise [ex]
  (let [terms (get-terms ex)
        ex-id (str (get ex :_id))]
    (reduce + (map (partial insert-term ex-id) terms))))

(defmacro rebuild-index [] `(do (mc/drop "exerciseIndex") (reduce + (map insert-exercise (mc/find-maps EXERCISE {})))))

(def search-limit 100)

(defn search-ids [& terms]
  (take search-limit (reduce clojure.set/intersection (map #(set (get (mc/find-one-as-map "exerciseIndex" {:_id (.toLowerCase %)}) :p)) terms))))

(defn search [& terms]
  (let [ids  (apply search-ids terms)]
    (log "TRACE" ids)
    (as-ex-result-list (map #(mc/find-one-as-map EXERCISE {:_id (ObjectId. %)}) ids))))

(defn search-wrapper [query]
  (let [query-string (get query :q)]
    (if (= query-string nil)
      '()
      (apply search (string/split query-string #" ")))))

(defn -main [& args]
  (rebuild-index))