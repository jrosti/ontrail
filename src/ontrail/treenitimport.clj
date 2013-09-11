(ns ontrail.treenitimport
  (:use [ontrail mongodb formats parser])
  (:require [clojure-csv.core :as csv]
            [clojure.string :as string]

            [clj-time.format :as format]
            [clj-time.core :as time]

            [monger.collection :as mc]
            [monger.result :as mr]
            [monger.joda-time]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(def date-parser (format/formatter (time/default-time-zone)
                                    "yyyy-MM-dd"
                                    "yyyy/MM/dd"))

(def as-date (partial format/parse date-parser))

(defn csv [filename]
  (csv/parse-csv (slurp filename)))

(defn str-value-of [ex-keys ex ex-key]
  (nth ex (.indexOf ex-keys ex-key)))

(defn as-value-ks [ex-keys conv-fn ex ex-key]
  (conv-fn (str-value-of ex-keys ex ex-key)))

(defn as-int [str]
  (try 
    (Integer. str)
    (catch Exception e
      0)))

(defn as-duration [str] 
  (let [timev (map as-int (re-seq #"[0-9]+" str))
        timemillis (reduce + (map * timev [360000 6000 100]))]
    timemillis))

(defn sport-mapping [sport-id]
  (let [sport-map {"Juoksu (VK)" "Juoksu"
                   "Kuntopiiri / Jumppa" "Jumppa"
                   "Hiihto" "Luisteluhiihto"}]
    (if (sport-map sport-id)
      (sport-map sport-id)
      sport-id)))

(defn extract-ex [ex-keys ex ex-id]
  (let [as-value (partial as-value-ks ex-keys)
        distance (as-value parse-distance ex (str "matka" ex-id))
        duration (as-value as-duration ex (str "kesto" ex-id))
        sport (as-value sport-mapping ex (str "harjoitus" ex-id))
        avghr (as-value as-int ex (str "keskisyke" ex-id))
        body (as-value identity ex (str "kommentti" ex-id))]
    (if (or (> distance 0) (> duration 0))
      {:sport sport
       :duration duration
       :distance distance
       :avghr avghr
       :title sport
       :body body
       :tags []}
      nil)))
    
(defn insert [user ex-keys ex]
  (let [as-value (partial as-value-ks ex-keys)
        creationDate (as-value as-date ex "pvm")
        resthr (as-value as-int ex "leposyke")
        weight (as-value parse-distance ex "paino")
        weather (as-value identity ex "saa")
        comment (as-value identity ex "kommentti")
        temperature (as-value identity ex "lampotila")
        date-and-user {:creationDate creationDate
                       :lastModifiedDate creationDate
                       :user user
                       :detail {:resthr resthr :weight weight
                                :comment comment :temperature temperature}
                       :origin "treenit.net"}
        subexs (map (partial extract-ex ex-keys ex) (range 1 6))]
      (mapv #(if % (mc/insert EXERCISE (merge date-and-user %))) subexs)))

(defn insert-all [user filename]
  (let [csv-data (csv filename)
        ex-keys (first csv-data)
        exs (rest csv-data)]
    (mapv (partial insert user ex-keys) exs)))

(defn test-insert[]
  (insert-all "Bråoddvar" "tnet.csv"))
