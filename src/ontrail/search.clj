(ns ontrail.search
  (:use [ontrail mongodb utils exercise formats])
  (:require [monger.collection :as mc]
            [monger.query :as mq]
            [clj-time.core :as time]
            [monger.result :as mr]
            [clojure.string :as string])
  (:import [org.bson.types ObjectId]))

(def minimum-term-length 2)
(def search-per-page 20)
(def not-too-short? #(>= (count %) minimum-term-length))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn tags-to-string [tags]
  (apply str (interpose " " tags)))

(def re-term #"[a-zåäö#0-9\-]+")

(defn to-term-seq [^String words]
  (if words
    (filter not-too-short? (re-seq re-term (.toLowerCase (strip-html words))))
    []))

(defn to-term-list [exercise] 
  (concat 
   (to-term-seq (tags-to-string (:tags exercise)))
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
    (to-term-list exercise))
          
(def inverted-index (ref {}))

(defn insert-term [assoc-fn ex-id index term]
  (if-let [postings (index term)]
    (let [new-val (conj postings ex-id)]
      (assoc-fn index term new-val))
    (assoc-fn index term #{ex-id})))

(defn insert-exercise-to-index [assoc-fn index ex]
  (let [terms (get-ex-terms ex)
        ex-id (str (:_id ex))] 
    (reduce (partial insert-term assoc-fn ex-id) index terms)))

(defn insert-exercise-inmem-index [ex]
  (dosync (alter inverted-index (partial insert-exercise-to-index assoc) ex)))
  
(defn rebuild-index []
  (let [new-index (transient {})]
    (count 
     (dosync 
       (ref-set inverted-index 
               (persistent! 
                (reduce (partial insert-exercise-to-index assoc!) new-index (mc/find-maps EXERCISE {}))))))))

(defn search-ids [& terms]
  (if (> (count terms) 0)
    (take search-per-page (apply clojure.set/intersection (map #(@inverted-index %) terms)))
    '()))

(defn search [& terms]
  (let [ids  (apply search-ids terms)]
    (.debug logger (str "Terms " terms " search result count: " (count ids)))
    (as-ex-result-list (sort-by :creationDate time/after? (filter (partial not= nil) (map #(mc/find-one-as-map EXERCISE {:_id (ObjectId. %)}) ids))))))

(defn search-wrapper [query]
  (let [query-string (:q query)
        terms (filter not-too-short? (re-seq re-term (.toLowerCase query-string)))]
    (if (> (count terms) 0)
      []
      (apply search terms))))
