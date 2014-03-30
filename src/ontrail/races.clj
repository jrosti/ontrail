(ns ontrail.races
  (:require 
   [monger.collection :as mc]
   [monger.query :as mq]
   [ontrail.parser :as parser]
   [monger.joda-time]))

(def races-coll "races")

(defn insert [params]
  (let [with-parsed-date (-> params
                             (select-keys [:title :date :filter])
                             (assoc :jodaDate (parser/parse-date (:date params))))]
    (-> (mc/insert-and-return races-coll with-parsed-date)
        (dissoc :_id))))

(defn find-all []
  (->> (mq/with-collection races-coll
         (mq/find {})
         (mq/sort {:jodaDate -1}))
       (map #(dissoc % :_id))))


