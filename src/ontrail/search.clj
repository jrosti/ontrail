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

;; MongoDB full text search for the exercise collection. 
;;
;; Maintains in-memory structures for indexing all documents in "exercise" collection.
;; Exercises are tokenized to lower case search terms, and the index is created at the 
;; startup. Updates are added incrementally. Deletions, or destructive modifications
;; are not updated to the index.
;;
;; Results set are paginated, and the result set is sorted by :lastModifiedDate 
;; -field of the exercise, so that the latest is first search result.
;; 

;; Ref to associative map from a search term to set of document id:s where 
;; search term occurred. Set of document ids is referred later postings of 
;; a search term. 
(def inverted-index (ref {}))

;; Timestamp structure for sorting the index. Atom is used, because
;; the existence timetamp is not required to be synchronized with
;; the search term index (inverted-index).
(def timestamps (atom {}))

(def min-term-length 2)
(def max-term-length 15)

(def search-per-page 20)

;; Common words have been decided by observing the index manually, because some words have large postings, 
;; like sport "Juoksu", and user still wants it to be included in the search result.
(def common-word #{"ja" "ei"})

(defn valid-term? [term] 
  (and (>= (count term) min-term-length) 
       (<= (count term) max-term-length)
       (not (common-word term))))

(defn tags-to-string [tags]
  (apply str (interpose " " tags)))

(def re-term #"[a-zåäö#0-9\-_]+")

(defn to-term-seq [^String words]
  (if (string? words)
    (filter valid-term? (re-seq re-term (to-lower (strip-html words))))
    []))

(defn exercise-to-terms [exercise] 
  (concat 
   (to-term-seq (tags-to-string (:tags exercise)))
   (to-term-seq (:user exercise))
   (to-term-seq (:body exercise))
   (to-term-seq (:title exercise))
   (to-term-seq (:sport exercise))
   (to-term-seq 
    (reduce 
     (fn [result comment] 
       (str result " " (:body comment) " " (:user comment))) 
     "" (:comments exercise)))))

(defn insert-term [assoc-fn ex-id index term]
  (if-let [postings (index term)]
    (let [new-val (conj postings ex-id)]
      (assoc-fn index term new-val))
    (assoc-fn index term #{ex-id})))

(defn get-last-modified-date [ex]
  (if-let [last-modified-date (:lastModifiedDate ex)]
    last-modified-date
    (do (.error logger (str "Inconsistent exercise: " (:_id ex) " without last modified timestamp"))
        (time/now))))

(defn insert-exercise-to-index [assoc-fn index ex]
  (let [terms (exercise-to-terms ex)
        ex-id (str (:_id ex))]
    (reduce (partial insert-term assoc-fn ex-id) index terms)))

(defn insert-exercise-inmem-index [ex]
  (swap! timestamps assoc (str (:_id ex)) (cljc/to-long (get-last-modified-date ex)))
  (count (dosync (alter inverted-index (partial insert-exercise-to-index assoc) ex))))

(defn rebuild-index []
  (let [updated-index (persistent! 
                       (reduce 
                        (partial insert-exercise-to-index assoc!) (transient {}) (mc/find-maps EXERCISE {})))]
    (do (dosync (ref-set inverted-index updated-index))
        "done")))

(defn intersect-and-sort [terms]
  (let [result (apply clojure.set/intersection (map @inverted-index terms))
        my-timestamps @timestamps
        sort-key-fn #(if-let [timestamp (my-timestamps %)] timestamp 0)
        sorted-result (sort-by sort-key-fn > result)]
    (.info logger (str "Intersect and sort hit: search intersection size: " (count sorted-result)))
    sorted-result))

;; Intersection and sort is memoized 120 seconds, in order not to redo this
;; operation in the infinite scroll of search results.
(def memo-intersect-and-sort
  (memo/ttl intersect-and-sort :ttl/threshold (* 120 1000))) 

(defn search-ids
  ([page terms] 
     (search-ids memo-intersect-and-sort page terms))
  ([intersect-fn terms page]
     (let [result (intersect-fn terms)
           full-head (take (* page search-per-page) result)]
       (if (> (count full-head) (* search-per-page (dec page)))
         {:results (take-last search-per-page (take (* page search-per-page) result)) :total (count result)}
         {:results [] :total (count result)}))))

(defn try-get-one [id]
  (try 
    (mc/find-one-as-map EXERCISE {:_id (ObjectId. ^String id)})
    (catch Exception exception
      (.error logger (str "Unable to get ex " id " " exception)))))

(defn stringify-terms 
  ([terms] 
     (stringify-terms @inverted-index terms))
  ([index terms]
     (reduce 
      (fn [result term] 
        (let [occurrences (count (index term))]
          (str result " " term " (" occurrences ")")))
      "" terms)))

(defn search [terms page]
  (let [result (search-ids terms page)
        ids (:results result)]
    (.debug logger (str "Terms " (stringify-terms terms) " page: " page " search result count: " (count ids)))
    {:results (as-ex-result-list (filter identity (map try-get-one ids))) :total (:total result)}))

(defn page-or-default [query]
  (try 
    (Integer/valueOf (:page query))
    (catch Exception e
      (.error logger (str "Q: " query " E: " e))
      1)))

(defn format-summary [results terms query-string] 
  (let [invalid-terms (filter (comp not valid-term?) (re-seq re-term (to-lower query-string)))]
    (str "Löydettiin " (:total results) " tulosta hakusanoilla " (stringify-terms terms)
         (if (> (count invalid-terms) 0) (str " ei käytetty sanoja: " (stringify-terms invalid-terms)) ""))))

(defn search-wrapper [query]
  (let [query-string (:q query)
        page (page-or-default query)
        terms (filter valid-term? (re-seq re-term (to-lower query-string)))]
    (if (> (count terms) 0)
      (let [res (search terms page)]
        {:results (:results res) :searchSummary (format-summary res terms query-string)})
      {:results [] :searchSummary (str "Ei tuloksia hakuun: " query-string)})))
