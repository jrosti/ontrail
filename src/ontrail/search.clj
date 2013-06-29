(ns ontrail.search
  (:use [ontrail mongodb utils exercise formats])
  (:require [monger.collection :as mc]
            [monger.query :as mq]
            [clj-time.core :as time]
            [clj-time.coerce :as cljc]
            [monger.result :as mr]
            [clojure.string :as string])
  (:import [org.bson.types ObjectId]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(def min-term-length 2)
(def max-term-length 15)

(def search-per-page 20)

(def common-word #{"ja" "ei"})

(defn valid-term? [term] 
  (and (>= (count term) min-term-length) 
       (<= (count term) max-term-length)
       (not (common-word term))))

(defn tags-to-string [tags]
  (apply str (interpose " " tags)))

(def re-term #"[a-zåäö#0-9\-]+")

(defn to-term-seq [^String words]
  (if words
    (filter valid-term? (re-seq re-term (.toLowerCase (strip-html words))))
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

;; Timetamp structure
(def timestamps (atom {}))

;; Optional structure to speed up searches by sorting the term list according to the frequency.
(def term-freq (atom {}))

(defn insert-term [assoc-fn ex-id index term]
  (if-let [postings (index term)]
    (let [new-val (conj postings ex-id)]
      (assoc-fn index term new-val))
    (assoc-fn index term #{ex-id})))

(defn insert-exercise-to-index [assoc-fn index ex]
  (let [terms (get-ex-terms ex)
        ex-id (str (:_id ex))]
    (swap! timestamps assoc ex-id (cljc/to-long (:lastModifiedDate ex)))
    (reduce (partial insert-term assoc-fn ex-id) index terms)))

(defn insert-exercise-inmem-index [ex]
  (count (dosync (alter inverted-index (partial insert-exercise-to-index assoc) ex))))

(defn count-freqs [] 
  (let [freqs (reduce (fn [res entry] (assoc res (first entry) (count (second entry)))) {} @inverted-index)]
    (count (reset! term-freq freqs))))

(defn rebuild-index []
  (let [new-index (transient {})]
     (dosync 
       (ref-set inverted-index 
               (persistent! 
                (reduce (partial insert-exercise-to-index assoc!) new-index (mc/find-maps EXERCISE {}))))))
  (count-freqs))

(defn to-fast-order [terms]
  (let [freqs @term-freq
        count-term #(if (freqs %) (freqs %) 0)]
    (sort-by count-term terms)))

(defn intersect [terms]
  (let [result (apply clojure.set/intersection (map #(@inverted-index %) (to-fast-order terms)))
        ts @timestamps
        sortfn #(if (ts %) (ts %) 0)
        sorted-result (sort-by sortfn > result)] ;; todo use lazy sort
    sorted-result))

(defn search-ids [page terms]
  (let [result (intersect terms)]
    (take-last search-per-page (take (* page search-per-page) result))))

(defn get-one [id]
  (try 
    (mc/find-one-as-map EXERCISE {:_id (ObjectId. id)})
    (catch Exception exception
      (.error logger (str "Unable to get ex " id " " exception)))))

(defn search [page terms]
  (let [ids  (search-ids page terms)]
    (.debug logger (str "Terms " terms " search result count: " (count ids)))
    (as-ex-result-list (filter identity (map get-one ids)))))

(defn search-wrapper [query]
  (let [query-string (:q query)
        terms (filter valid-term? (re-seq re-term (.toLowerCase query-string)))]
    (if (> (count terms) 0)
      (search 1 terms)
      [])))
