(ns ontrail.mutate
  (:use [ontrail mongodb utils search exercise user formats])
  (:require [monger.collection :as mc]
            [monger.result :as mr]
            [clj-time.format :as format]
            [clojure.string :as string]
            [clj-time.core :as time]
            ;; for date serialization to mongo.
            [monger.joda-time])
  (:import [org.bson.types ObjectId]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(def multi-parser (format/formatter (time/default-time-zone)
                                    "dd.MM.yyyy"
                                    "dd-MM-yyyy"
                                    "dd/MM/yyyy"
                                    "yyyy/MM/dd"))


(defn as-number [x] (Integer. x))
(defn to-db [min] (* (Integer. min) 60 100))
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
    {:re #"^([0-9]+)[:\.]([0-9]+)[:\.]([0-9]+)$" :conv hours-and-minutes-and-seconds}
    {:re #"^([0-9]+) min ([0-9]+),([0-9]) s$" :conv minutes-and-seconds-and-tenths}
    {:re #"^([0-9]+)\.([0-9]+),([0-9])[^0-9]*$" :conv minutes-and-seconds-and-tenths}
    {:re #"^([0-9]+)\.([0-9]+),([0-9])([0-9])[^0-9]*$" :conv minutes-and-seconds-and-tenths-and-hundreds}
    ])

(defn try-match [re str]
  (re-matches re str))

(defn try-parse [re-conv str]
  (let [match (try-match (:re re-conv) str)]
    (if match (apply (:conv re-conv) (rest match)))))

(defn parse-duration [dur-str] 
  (some identity (map #(try-parse % dur-str) duration-regexps)))

(defn parse-date [date-str]
  (time/plus (format/parse multi-parser date-str) (time/hours 12)))

(def distance-regexps
  [{:re #"^([0-9]+)$" :conv as-number}
   {:re #"^([0-9]+) *m *$" :conv as-number}
   {:re #"^([0-9]+) *k$" :conv kilometers}
   {:re #"^([0-9]+) *km$" :conv kilometers}
   {:re #"^([0-9]+) *[k\.,][^0-9]*([0-9]+)" :conv kilometers-and-meters}])

(defn parse-distance [dist]
  (some identity (map #(try-parse % dist) distance-regexps)))

(defn parse-tags
  ([] '())
  ([tags]
     (let [trim-tag #(-> % string/trim)]
       (if (string? tags)
         (string/split (trim-tag tags) #",")
         '()))))

(defn parse-natural [hr]
  (if-not (= nil hr)
    (try-parse {:re #"^([0-9]+)$" :conv as-number} hr)))

(defn from-user-ex [user user-ex]
  (let [bare-ex {:title (:title user-ex)
                 :duration (parse-duration (:duration user-ex))
                 :sport (:sport user-ex)
                 :creationDate (parse-date (:date user-ex))
                 :lastModifiedDate (time/now)
                 :user user}
        body (if (nil? (:body user-ex)) "" (:body user-ex)) ;; disallow nil body
        tags (parse-tags (:tags user-ex))
        avghr (parse-natural (:avghr user-ex))
        distance (parse-distance (:distance user-ex))]
    (-> bare-ex
        (assoc :body body)
        (assoc :tags tags)
        (assoc :distance distance)
        (assoc :avghr avghr) 
        (assoc :comments '()))))

(defn create-ex [user params]
  (.debug logger (str (:user params) " creating ex " params))
  (let [ret  (mc/insert-and-return EXERCISE (from-user-ex user params))
        str-id (str (:_id ret))
        tret (assoc  (dissoc ret :_id) :id str-id)]
    (insert-exercise-inmem-index ret)
    (.debug logger (str (:user params) " created ex " ret))
    (as-ex-result tret)))

(defn comment-ex [user params]
  (.debug logger (str user " creating comment " params))
  (mc/update-by-id EXERCISE
                   (ObjectId. (:id params))
                   {"$set" {:lastModifiedDate (time/now)}
                    "$push" {:comments {:avatar (get-avatar-url user)
                                        :title (:title params)
                                        :date (to-human-date (time/now))
                                        :user user
                                        :body (:body params)}}})
  (.debug logger (str user " created comment " params))
  (get-ex (:id params)))