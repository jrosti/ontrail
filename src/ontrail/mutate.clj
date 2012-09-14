(ns ontrail.mutate
  (:use [ontrail mongodb utils search])
  (:require [monger.collection :as mc]
            [monger.result :as mr]
            [clj-time.format :as format]
            [clojure.string :as string]
            [clj-time.core :as time]
            ;; for date serialization to mongo.
            [monger.joda-time]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(def multi-parser (format/formatter (time/default-time-zone)
                                    "dd.MM.yyyy"
                                    "dd-MM-yyyy"
                                    "dd/MM/yyyy"
                                    "yyyy/MM/dd"))
(defn parse-time [time-str]
  (format/parse multi-parser time-str))

(defn date-ok? [date]
  (not-nil? (try (parse-time date)
                 (catch Exception e (.debug logger (str "ex in parse date" date e))))))

(defn sport-ok? [sport]
  (not-nil? (mc/find-one-as-map ONSPORT {:_id sport})))

(defn title-ok? [title]
  (and (not-nil? title) (> (count title) 0)))

(defn duration-ok? [dur]
  (positive-numbers? (list dur)))

(defn valid? [uex]
  "Defines minimal set of keys for a valid ex"
  (and (title-ok? (:title uex))
       (duration-ok? (:duration uex))
       (sport-ok? (:sport uex))
       (date-ok? (:date uex))))

(defn parse-distance [d]
  (Integer. d))

(defn parse-duration [d] 
  (* (Integer. d) 60 100))

(defn from-user-ex [user uex]
  (let [bare-ex {:title (:title uex)
                 :duration (parse-duration (:duration uex))
                 :sport (:sport uex)
                 :creationDate (parse-time (:date uex))
                 :lastModifiedDate (parse-time (:date uex))
                 :user user}
        body (if (= nil (:body uex)) "" (:body uex)) ;; disallow nil body
        tags (if (= nil (:tags uex)) '() (:tags uex)) ;; default empty tag list or tags
        ;avghr (if (positive-numbers? (list (:avghr uex))) (int (:avghr uex)) nil)
        distance (parse-distance (:distance uex))]
    (-> bare-ex
        (assoc :body body)
        (assoc :tags tags)
        (assoc :distance distance)
        (assoc :avghr 0) ;; How to not insert if avghr nil?
        (assoc :comments '()))))

(defn create-ex [user user-input-ex]
  (let [ret  (mc/insert-and-return EXERCISE (from-user-ex user user-input-ex))]
    (.debug logger (format "User %s created an ex %s " user ret))
    (insert-exercise-inmem-index ret)))
          
(defn create-ex-wrapper [params]
  (create-ex (:user params) params))