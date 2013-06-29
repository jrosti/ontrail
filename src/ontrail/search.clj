(ns ontrail.search
  (:use [ontrail mongodb utils exercise formats])
  (:require [monger.collection :as mc]
            [monger.query :as mq]
            [clj-time.core :as time]
            [clj-time.coerce :as cljc]
            [monger.result :as mr]
            [clojure.core.memoize :as memo]
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

(def re-term #"[a-zåäö#0-9\-_]+")

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
    (if (> (count terms) 2)
      (sort-by count-term terms)
      terms)))

(defn intersect-and-sort [terms]
  (let [result (apply clojure.set/intersection (map #(@inverted-index %) (to-fast-order terms)))
        ts @timestamps
        sortfn #(if (ts %) (ts %) 0)
        sorted-result (sort-by sortfn > result)]
    (.info logger (str "Intersect and sort hit: search intersection size: " (count sorted-result)))
    sorted-result))

;; intersection is the heaviest operation, and it is memoized 60 seconds, in order not to redo this
;; in infinite scroll
(def memo-intersect
  (memo/ttl intersect-and-sort :ttl/threshold (* 60 1000))) 

(defn search-ids [page terms]
  (let [result (memo-intersect terms)
        full-head (take (* page search-per-page) result)]
    (if (> (count full-head) (* search-per-page (dec page)))
      {:results (take-last search-per-page (take (* page search-per-page) result)) :total (count result)}
      {:results [] :total (count result)})))
  
(defn try-get-one [id]
  (try 
    (mc/find-one-as-map EXERCISE {:_id (ObjectId. id)})
    (catch Exception exception
      (.error logger (str "Unable to get ex " id " " exception)))))

(defn str-terms [terms] 
  (reduce #(str % " " %2 (if (and (@term-freq %2) (> (@term-freq %2) 0)) (str " (" (@term-freq %2) ")") "")) "" terms))

(defn search [page terms]
  (let [res (search-ids page terms)
        ids (:results res)]
    (.debug logger (str "Terms " (str-terms terms) " page: " page " search result count: " (count ids)))
    {:results (as-ex-result-list (filter identity (map try-get-one ids))) :total (:total res)}))

(defn page-or-default [query]
  (try 
    (Integer/valueOf (:page query))
    (catch Exception e
      (.error logger (str "Q: " query " E: " e))
      1)))

(defn format-summary [results terms query-string] 
  (let [invalid (filter #(not (valid-term? %)) (re-seq re-term (.toLowerCase query-string)))]
    (str "Löydettiin " (:total results) " tulosta hakusanoilla " (str-terms terms)
         (if (> (count invalid) 0) (str " ei käytetty sanoja: " (str-terms invalid)) ""))))

(defn search-wrapper [query]
  (let [query-string (:q query)
        page (page-or-default query)
        terms (filter valid-term? (re-seq re-term (.toLowerCase query-string)))]
    (if (> (count terms) 0)
      (let [res (search page terms)]
        {:results (:results res) :searchSummary (format-summary res terms query-string)})
      {:results [] :searchSummary (str "Ei tuloksia hakuun: " query-string)})))
