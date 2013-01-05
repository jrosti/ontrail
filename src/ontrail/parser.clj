(ns ontrail.parser
  (:use [ontrail formats])
  (:require [clj-time.format :as format]
            [clojure.string :as string]
            [clj-time.core :as time]))

(def multi-parser (format/formatter (time/default-time-zone)
                                    "dd.MM.yyyy"
                                    "dd-MM-yyyy"
                                    "dd/MM/yyyy"
                                    "yyyy/MM/dd"))


(defn as-number [x] (Integer/valueOf x))
(defn to-db [min] (* (Integer/valueOf min) 60 100))
(defn minutes [min] (to-db min))
(defn hours [h] (* (to-db h) 60))
(defn secs [sec] (* (Integer. sec) 100))
(defn hours-and-minutes [h min] (+ (hours h) (to-db min)))
(defn minutes-and-seconds [min sec] (+ (minutes min) (secs sec)))
(defn hours-and-minutes-and-seconds [h min sec] (+ (hours h) (minutes min) (secs sec)))
(defn minutes-and-seconds-and-tenths [min sec tenths]  
  (+ (to-db min) (secs sec) (* 10 (Integer. tenths))))
(defn minutes-and-seconds-and-tenths-and-hundreds [min sec tenths hundreds]
  (+ (to-db min) (secs sec) (* 10 (Integer. tenths)) (Integer. hundreds)))

(defn kilometers [km] (* (Integer. km) 1000))
(defn kilometers-and-meters [km m] (+ (as-number m) (kilometers km)))

(def duration-regexps
  [ {:re #"^([0-9]+) *m[^0-9]*$" :conv minutes}
    {:re #"^([0-9]+)$" :conv minutes}
    {:re #"^([0-9]+).*h$" :conv hours}
    {:re #"^([0-9]+).*h[^0-9]*([0-9]+)[^0-9]*$" :conv hours-and-minutes}
    {:re #"^([0-9]+)\.([0-9]+)[^0-9]*$" :conv minutes-and-seconds}
    {:re #"^([0-9]+)[^0-9]*min[^0-9]*([0-9]+)[^0-9]*s[^0-9]*$" :conv minutes-and-seconds}
    {:re #"^([0-9]+):([0-9]+)$" :conv hours-and-minutes}
    {:re #"^([0-9]+) h ([0-9]+) min$" :conv hours-and-minutes}
    {:re #"^([0-9]+) h ([0-9]+) min ([0-9]+) s$" :conv hours-and-minutes-and-seconds}
    {:re #"^([0-9]+)h([0-9]+)m[^0-9]+([0-9]+)$" :conv hours-and-minutes-and-seconds}
    {:re #"^([0-9]+)[:\.]([0-9]+)[:\.]([0-9]+)$" :conv hours-and-minutes-and-seconds}
    {:re #"^([0-9]+) min ([0-9]+),([0-9]) s$" :conv minutes-and-seconds-and-tenths}
    {:re #"^([0-9]+) min ([0-9]+),([0-9])([0-9]) s$" :conv minutes-and-seconds-and-tenths-and-hundreds}
    {:re #"^([0-9]+)\.([0-9]+),([0-9])[^0-9]*$" :conv minutes-and-seconds-and-tenths}
    {:re #"^([0-9]+)\.([0-9]+),([0-9])([0-9])[^0-9]*$" :conv minutes-and-seconds-and-tenths-and-hundreds}
    ])

(defn try-match [re str]
  (re-matches re str))

(defn try-parse [re-conv str]
  (let [match (try-match (:re re-conv) (string/trim str))]
    (if match (apply (:conv re-conv) (rest match)))))

(defn parse-duration [dur-str] 
  (some identity (map #(try-parse % dur-str) duration-regexps)))

(defn parse-date [date-str]
  (if (= "" date-str)
    (time/now)
    (time/plus (format/parse multi-parser date-str) (time/hours 12))))

(defn as-double-km [str]
  (let [x (string/replace str #"," ".")]
    (int (* 1000 (Double. x)))))

(def distance-regexps
  [{:re #"^([0-9]+)$" :conv as-double-km}
   {:re #"^([0-9]+[\.,][0-9]+) *k*m*$" :conv as-double-km}
   {:re #"^([0-9]+) *m *$" :conv as-number}
   {:re #"^([0-9]+) *k$" :conv kilometers}
   {:re #"^([0-9]+) *km$" :conv kilometers}])

(defn parse-distance [dist]
  (try
    (let [parse-result (some identity (map #(try-parse % dist) distance-regexps))]
      (case dist
        "" 0
        "kilsa" 1000
        "maraton" 42195
        "mara" 42195
        "maili" 1609
        (if (>= parse-result 1000000) ;; bare number is interpreted as meters, if it is over "1000km"
          (quot parse-result 1000)
          parse-result)))
    (catch Exception exception
        0)))
  

(defn parse-tags
  ([] '())
  ([tags]
     (let [trim-tag #(-> % string/trim)]
       (if (string? tags)
         (filter (partial not= "") (string/split (trim-tag tags) #","))
         '()))))

(defn parse-natural [hr]
  (if-not (= nil hr)
    (try-parse {:re #"^([0-9]+)$" :conv as-number} hr)))