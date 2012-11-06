(ns ontrail.search
  (:use [ontrail mongodb utils exercise formats readcount])
  (:require [monger.collection :as mc]
            [monger.query :as mq]
            [clj-time.core :as time]
            [monger.result :as mr]
            [clojure.string :as string])
  (:import [org.bson.types ObjectId]))

(def minimum-term-length 3)
(def search-limit 300)
(def not-too-short-term? #(>= (count %) minimum-term-length))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn tags-to-string [tags]
  (apply str (interpose " " tags)))

(defn kms[d]
  (str "km:" (quot d 1000)))

(defn get-ex-terms [exercise]
  (let [part (partial get exercise)
        ex-date (:creationDate exercise)
        ex-distance (:distance exercise)
        words (.toLowerCase (str (part :user) " " (part :sport) " "
                                 (part :body) " " (part :title) " "
                                 (tags-to-string (part :tags))))
        clean-words (string/replace (strip-html words) #"[^a-zåäö#0-9]+" " ")
        bare-term-list (string/split clean-words #" +")
        term-list (filter not-too-short-term? bare-term-list)
        extra-terms (conj term-list
                          (str "y:" (time/year ex-date))
                          (str "m:" (time/month ex-date)))]
    (if (number? ex-distance)
      (conj extra-terms (kms ex-distance))
      extra-terms)))
      
          
(def inverted-index (atom {}))

(defn fst [x y] x)

(defn insert-term [ex-id term]
  (let [index @inverted-index]
    (if (not (contains? index term))
      (fst 1 (swap! inverted-index assoc term #{ex-id}))
      (fst 0 (let [new-val (clojure.set/union (get index term) #{ex-id})]
        (swap! inverted-index assoc term new-val))))))

(defn insert-exercise-inmem-index [ex]
  (let [terms (get-ex-terms ex)
        ex-id (str (:_id ex))]
    (reduce + (map (partial insert-term ex-id) terms))))

(defn rebuild-index []
  (do (reset! inverted-index {})
      (apply + (map insert-exercise-inmem-index (mc/find-maps EXERCISE {})))))

(defn search-ids [& terms]
  (let [filtered-terms (filter not-too-short-term? terms)]
    (if (> (count filtered-terms) 0)
      (take search-limit (apply clojure.set/intersection (map #(get @inverted-index (.toLowerCase %)) filtered-terms)))
      '())))

(defn search [& terms]
  (let [ids  (apply search-ids terms)]
    (.debug logger (str "Terms " terms " search result count: " (count ids)))
    (as-ex-result-list zero-fun (sort-by :creationDate time/after? (filter (partial not= nil) (map #(mc/find-one-as-map EXERCISE {:_id (ObjectId. %)}) ids))))))

(defn search-wrapper [query]
  (let [query-string (:q query)]
    (if (nil? query-string)
      '()
      (apply search (string/split query-string #" +")))))
