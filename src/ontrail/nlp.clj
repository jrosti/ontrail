(ns ontrail.nlp)

(def verb-map {"Pyöräily" "pyöräili"
               "Uinti" "ui"
               "Suunnistus" "suunnisti"
               "Juoksu" "juoksi"
               "Squash" "pelasi squashia"
               "Kävely" "käveli"
               "Sulkapallo" "sulkapalloili"})

(defn get-verb [sport-id]
  (if (string? sport-id)
    (let [verb (verb-map sport-id)]
      (if (= nil verb)
        (str "harrasti lajia " (.toLowerCase sport-id))
        verb))
    "nil-sport-id"))