(ns ontrail.search
  (:use [ontrail mongodb utils exercise formats])
  (:require [monger.collection :as mc]
            [monger.query :as mq]
            [clj-time.core :as time]
            [monger.result :as mr]
            [clojure.string :as string])
  (:import [org.bson.types ObjectId]))

(def minimum-term-length 2)
(def search-limit 100)
(def not-too-short-term? #(>= (count %) minimum-term-length))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn tags-to-string [tags]
  (apply str (interpose " " tags)))

(defn kms[d]
  (str "km:" (quot d 1000)))

(def re-term #"[a-zåäö#0-9\-]+")

(defn to-term-seq [^String words]
  (if words
    (re-seq re-term (.toLowerCase (strip-html words)))
    []))

(defn to-bare-term-list [exercise] 
  (concat 
   (to-term-seq (:user exercise))
   (to-term-seq (:body exercise))
   (to-term-seq (:title exercise))
   (to-term-seq (:sport exercise))
   (to-term-seq (reduce (fn [a b] 
                          (if (and b (:body b)) 
                            (str a " " (:body b)) 
                            a)) 
                        "" (:comments exercise)))
                     ))

(defn get-ex-terms [exercise]
  (let [ex-date (:creationDate exercise)
        ex-distance (:distance exercise)
        bare-term-list (to-bare-term-list exercise)
        term-list (filter not-too-short-term? bare-term-list)]
    term-list))      
          
(def inverted-index (atom {}))

(defn insert-term [assoc-fn index ex-id term]
  (if-let [postings (index term)]
    (assoc-fn index term #{ex-id})
    (let [new-val (conj (index term) ex-id)]
      (assoc-fn index term new-val))))

(defn insert-exercise-to-index [assoc-fn index ex]
  (let [terms (get-ex-terms ex)
        ex-id (str (:_id ex))]
    (reduce (partial insert-term assoc-fn index) terms)))

(def insert-exercise-inmem-index
  (partial insert-exercise-to-index assoc @inverted-index))
  
(defn rebuild-index []
  (let [new-index (transient {})]
    (count (do (reset! inverted-index (persistent! (reduce (partial insert-exercise-to-index assoc!) new-index (mc/find-maps EXERCISE {}))))))))

(defn search-ids [& terms]
  (let [filtered-terms (filter not-too-short-term? terms)]
    (if (> (count filtered-terms) 0)
      (take search-limit (apply clojure.set/intersection (map #(get @inverted-index (.toLowerCase %)) filtered-terms)))
      '())))

(defn search [& terms]
  (let [ids  (apply search-ids terms)]
    (.debug logger (str "Terms " terms " search result count: " (count ids)))
    (as-ex-result-list (sort-by :creationDate time/after? (filter (partial not= nil) (map #(mc/find-one-as-map EXERCISE {:_id (ObjectId. %)}) ids))))))

(defn search-wrapper [query]
  (let [query-string (:q query)]
    (if (nil? query-string)
      '()
      (apply search (re-seq re-term (.toLowerCase query-string))))))
