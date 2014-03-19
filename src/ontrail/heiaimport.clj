(ns ontrail.heiaimport
  (:require [ontrail.mutate :as m]
            [clojure.data.json :as json]
            [monger.collection :as mc]
            ))

(def sport-mapping {"Avokanootti" {:tags "avokanootti" :sport "Muu laji"}
                    "Etunojapunnerrus" {:sport "Kuntopiiri" :tags "etunojapunnerrus"}
                    "Fitnesspallo" {:sport "Jumppa" :tags "fitnesspallo"}
                    "Halonhakkuu" {:sport "Kuntopiiri" :tags "halonhakkuu"}
                    "Keppijumppa" {:sport "Kuntopiiri" :tags "keppijumppa"}
                    "Liikkuvuusharjoitteet" {:sport "Venyttely" :tags "liikkuvuusharjoitteet"}
                    "Paino:" {:ignore true}
                    "Portaiden nousu" {:sport "Kävely" :tags "porraskävely"}
                    "Sairauspäivä" {:sport "Sairaus"}
                    "Sienestys" {:sport "Kävely" :tags "sienestys"}
                    "Tehokävely" {:sport "Kävely" :tags "tehokävely"}
                    "Toiminnallinen harjoittelu" {:sport "Kuntopiiri" :tags "toiminnallinen"}
                    "Tuomarointi" {:sport "Muu merkintä" :tags "tuomarointi"}})

(defn transform [input]
  (let [mapping (sport-mapping (input "sport"))
        with-date (assoc input :date (input "creationDate"))
        kw (into {} 
                 (for [[k v] with-date] 
                   [(keyword k) v]))]
    (when (not mapping) kw)
    (when (:ignore mapping) nil)
    (merge kw mapping)))

(defn import-json [user filename]
  (let [exs (json/read-str (slurp filename))]
    (doseq [ex exs]
      (mc/insert-and-return "exercise" (merge (m/from-user-ex user (transform ex))
                                              {:hid (Long/parseLong (ex "hid"))})))))
        
(defn main- [user filename]
  (import-json user filename))
