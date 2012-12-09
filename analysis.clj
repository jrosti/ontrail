(require '[monger.query :as mq])
(require '[clj-time.core :as time])
(require '[monger.collection :as mc])
(use 'monger.operators)
(use 'clojure.java.io)

(defn exs[year] (mq/with-collection "exercise" (mq/find {:user "maja" :sport "Sisäsoutu" :creationDate {:$gte (time/date-time year 1 1) :$lte (time/date-time year 12 30)}})))

(defn minkm [dist dur]
  (if (> dist 0)
    (let [km (/ dist 1000.0) min (/ dur 6000.0)]
      (/ min km))
    -1.0))

(defn pacedistmap [year] (map #(list (minkm (% :distance) (% :duration)) (% :distance)) (exs year)))

(defn w[afile amap]
  (let [owriter (writer afile)]
    (doall (map #(.write owriter (format "%f %d\n" (first %) (second %))) amap))
    (.close owriter)))

