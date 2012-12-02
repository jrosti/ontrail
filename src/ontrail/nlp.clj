(ns ontrail.nlp)

(def verb-map {"Golf" "golffasi" 
               "Hieronta" "oli hierottavana" 
               "Jalkapallo" "jalkapalloili" 
               "Jooga" "joogasi" 
               "Jumppa" "jumppasi" 
               "Juoksu" "juoksi" 
               "Jääkiekko" "jääkiekkoili" 
               "Kamppailulaji" "kamppaili" 
               "Kaukalopallo" "kaukalopalloili" 
               "Kickbike" "kikkaili" 
               "Kiipeily" "kiipeili" 
               "Koripallo" "koripalloili" 
               "Kuntopiiri" "teki kuntopiiriä" 
               "Kuntosali" "kävi kuntosalilla" 
               "Kävely" "käveli" 
               "Laskettelu" "lasketteli" 
               "Lentopallo" "lentopalloili" 
               "Luistelu" "luisteli" 
               "Luisteluhiihto" "luisteluhiihti" 
               "Lumikenkäily" "lumikenkäili" 
               "Lumilautailu" "lumilautaili" 
               "Melonta" "meloi" 
               "Muu laji" "teki jotain muuta" 
               "Muu merkintä" "merkitsi jotain muuta" 
               "Nyrkkeily" "nyrkkeili" 
               "Perinteinen hiihto" "hiihti" 
               "Pyöräily" "pyöräili" 
               "Ratsastus" "ratsasti" 
               "Rullahiihto" "rullahiihti" 
               "Rullaluistelu" "rullaluisteli" 
               "Sauvakävely" "sauvakäveli" 
               "Seikkailu-urheilu" "seikkaili"
               "Sisäsoutu" "souti ergometrillä" 
               "Soutu" "souti" 
               "Spinning" "spinnasi" 
               "Squash" "pelasi squashia" 
               "Sulkapallo" "pelasi sulista" 
               "Suunnistus" "suunnisti" 
               "Sähly" "pelasi sählyä" 
               "Tanssi" "tanssi" 
               "Tennis" "pelasi tennistä"
               "Telinevoimistelu" "telinevoimisteli"
               "Triathlon" "ui, pyöräili ja juoksi" 
               "Uinti" "ui" 
               "Vaellus" "vaelsi" 
               "Venyttely" "venytteli" 
               "Vesijuoksu" "vesijuoksi" 
               "Yleisurheilu" "yleisurheili"})

(def sports (sort (keys verb-map)))

(defn get-verb [sport-id]
  (if (string? sport-id)
    (let [verb (verb-map sport-id)]
      (if (= nil verb)
        (str "harrasti lajia " (.toLowerCase sport-id))
        verb))
    "nil-sport-id"))