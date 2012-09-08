(ns ontrail.search
  (:use [ontrail mongodb utils log exercise])
  (:require [monger.collection :as mc]
            [monger.query :as mq]
            [monger.result :as mr]
            [clojure.string :as string])
  (:import [org.bson.types ObjectId]))

(defn get-ex-terms [exercise]
  (let [part (partial get exercise)
        words (.toLowerCase (str (part :user) " " (part :sport) " " (part :body) " " (part :title)))
        clean-words (string/replace (strip-html words) #"[^a-zåäö]+" " ")
        bare-term-list (string/split clean-words #" +")]
    (filter #(> (count %) 3) bare-term-list))) ;; search terms must contain more than three letters, in order to ignore too common ones

(def inverted-index (atom {}))

(defn fst [x y]
  x)

(defn insert-term [ex-id term]
  (let [index @inverted-index]
    (if (not (contains? index term))
      (fst 0 (swap! inverted-index assoc term #{ex-id}))
      (fst 1 (let [new-one (merge-with clojure.set/union index {term #{ex-id}})]
        (swap! inverted-index assoc term (get new-one term)))))))

(defn insert-exercise-inmem-index [ex]
  (let [terms (get-ex-terms ex)
        ex-id (str (:_id ex))]
    ;;(log "TRACE" terms)
    (reduce + (map (partial insert-term ex-id) terms))))

(defmacro rebuild-index []
  `(do (reset! inverted-index {})
       (reduce + (map insert-exercise-inmem-index (mc/find-maps EXERCISE {})))))

(def search-limit 1000)

(defn search-ids [& terms]
  (take search-limit (reduce clojure.set/intersection (map #(get @inverted-index (.toLowerCase %)) terms))))

(defn search [& terms]
  (let [ids  (apply search-ids terms)]
    (log "TRACE" " search result " ids)
    (as-ex-result-list (filter (partial not= nil) (map #(mc/find-one-as-map EXERCISE {:_id (ObjectId. %)}) ids)))))

(defn search-wrapper [query]
  (let [query-string (:q query)]
    (if (= query-string nil)
      '()
      (apply search (string/split query-string #" ")))))

(defn -main [& args]
  (rebuild-index))