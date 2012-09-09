(ns ontrail.mutate
  (:use [ontrail mongodb log utils search])
  (:require [monger.collection :as mc]
            [monger.result :as mr]
            [clj-time.format :as format]
            [clojure.string :as string]
            [clj-time.core :as time]
            ;; for date serialization to mongo.
            [monger.joda-time]))

(def multi-parser (format/formatter (time/default-time-zone)
                                    "dd.MM.yyyy"
                                    "dd-MM-yyyy"
                                    "dd/MM/yyyy"
                                    "yyyy/MM/dd"))
(defn parse-time [time-str]
  (format/parse multi-parser time-str))

(defn date-ok? [date]
  (not-nil? (try (parse-time date)
                 (catch Exception e (log "DEBUG" "ex in parse date" date e)))))

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
       
(defn from-user-ex [user uex]
  (let [bare-ex {:title (:title uex)
                 :duration (* (Integer. (:duration uex)) 60 100)
                 :sport (:sport uex)
                 :creationDate (parse-time (:date uex))
                 :lastModifiedDate (parse-time (:date uex))
                 :user user}
        body (if (= nil (:body uex)) "" (:body uex)) ;; disallow nil body
        tags (if (= nil (:tags uex)) '() (:tags uex)) ;; default empty tag list or tags
        avghr (if (positive-numbers? (list (:avghr uex))) (int (:avghr uex)) nil)
        distance (if (positive-numbers? (list (:distance uex))) (:distance uex) 0)]
    (-> bare-ex
        (assoc :body body)
        (assoc :tags tags)
        (assoc :distance distance)
        (assoc :avghr avghr) ;; How to not insert if avghr nil?
        (assoc :comments '()))))

(defn create-ex [user user-input-ex]
  (log "DEBUG" (format "User %s created an ex %s" user (:title user-input-ex)))
  (if (valid? user-input-ex)
    (insert-exercise-inmem-index
     (mc/insert-and-return EXERCISE (from-user-ex user user-input-ex)))))
