(ns ontrail.heiaimport
  (:require [ontrail.mutate :as m]
            [clojure.data.json :as json]
            [monger.collection :as mc]
            [ontrail.nlp :as nlp]
            [clojure.string :as string]
            ))

(def sport-mapping {
                    "Rantalentopallo" {:sport "Beach volley"}
                    "Taido" {:sport "Kamppailulaji" :tags "taido"}
                    "Taekwondo" {:sport "Kamppailulaji" :tags "taekwondo"}
                    "Fitnesspallo" {:sport "Jumppa" :tags "fitnesspallo"}
                    "Halonhakkuu" {:sport "Kuntopiiri" :tags "halonhakkuu"}
                    "Keppijumppa" {:sport "Kuntopiiri" :tags "keppijumppa"}
                    "Liikkuvuusharjoitteet" {:sport "Venyttely" 
                                             :tags "liikkuvuusharjoitteet"}
                    "Paino:" {:ignore true}
                    "Paino" {:ignore true}
                    "Portaiden nousu" {:sport "Kävely" :tags "porraskävely"}
                    "Sairauspäivä" {:sport "Sairaus"}
                    "Sienestys" {:sport "Kävely" :tags "sienestys"}
                    "Tehokävely" {:sport "Kävely" :tags "tehokävely"}
                    "Toiminnallinen harjoittelu" {:sport "Kuntopiiri" 
                                                  :tags "toiminnallinen"}
                    "Tuomarointi" {:sport "Muu merkintä" :tags "tuomarointi"}
                    "Kajakki" {:sport "Melonta" :tags "kajakki"}
                    "Koiran ulkoiluttaminen" {:sport "Juoksu" :tags "koira"}
                    "Hiihto" {:sport "Luisteluhiihto"}
                    "Kehonpainoharjoitus" {:sport "Kuntopiiri" :tags "kehonpaino"}
                    "Trail running" {:sport "Maastojuoksu"}
                    "Etunojapunnerrus" {:sport "Kuntopiiri" :tags "punnerrus"}
                    "Terapeuttinen harjoittelu" {:sport "Jumppa"
                                                 :tags "kuntoutus"}
                    "Avantouinti" {:sport "Uinti" :tags "avantouinti"}
                    "Lumikenkäkävely" {:sport "Lumikenkäily"}
                    "Vuorikiipeily" {:sport "Kiipeily" :tags "vuorikiipeily"}
                    "Moottoripyöräily" {:sport "Muu merkintä" :tags "moottoripyöräily"}
                    "Potkypyöräily" {:sport "Kickbike"}
                    "Rakennustyöt" {:sport "Muu merkintä" :tags "rakentaminen"}
                    "Remontointi" {:sport "Muu merkintä" :tags "remontointi"}
                    "Rogaining" {:sport "Suunnistus" :tags "rogaining"}
                    "Suoritin" {:sport "Muu merkintä"}
                    "Avovestiuinti" {:sport "Uiniti" :tags "avovesi"}
                    "Jalkakyykky" {:sport "Kuntosali" :tags "jalkakyykky"}
                    "Leijahiihto" {:sport "Muu laji" :tags "kite"}
                    "Lenkkeily" {:sport "Juoksu"}
                    "BodyPump" {:sport "Pumppi"}
                    "Avokanootti" {:sport "Melonta" :tags "avokanootti"}
                    "Kuntopallo" {:sport "Jumppa" :tags "deadball"}
                    "Ab wheel" {:sport "Jumppa" :tags "abwheel"}
                    "Verenluovutus" {:sport "Muu merkintä" :tags "verenluovutus"}
                    "Kärrykävely" {:sport "Kävely" :tags "lastenvaunut"}
                    "Juoksumatto" {:sport "Juoksu" :tags "mattojuoksu"}
                    "Koskimelonta" {:sport "Melonta" :tags "koskimelonta"}})

(defn as-tag [sport]
  (-> sport .toLowerCase (string/replace #" " "")))

(defn transform [input]
  (let [sport (input "sport")
        mapping (sport-mapping sport)
        with-date (assoc input :date (input "creationDate"))
        result (into {} 
                     (for [[k v] with-date] 
                       [(keyword k) v]))]
    (cond (and (not mapping) (not (nlp/verb-map sport)))
          (merge result {:sport "Muu laji" :tags (as-tag sport)})
          (not mapping) result
          (and mapping (:ignore mapping)) nil
          true (merge result mapping))))

(defn import-json [user filename]
  (let [exs (json/read-str (slurp filename))
        clean-exs (filter identity (map transform exs))]
    (doseq [ex clean-exs]
      (mc/insert-and-return "exercise" (merge (m/from-user-ex user ex)
                                              {:hid (Long/parseLong (ex :hid))})))))
        
(defn main- [user filename]
  (import-json user filename))
