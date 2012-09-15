(ns ontrail.mutate
  (:use [ontrail mongodb utils search])
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

(defn parse-tags
  ([] '())
  ([tags]
     (let [trim-tag #(-> % .toLowerCase string/trim)]
       (if (string? tags)
         (string/split (trim-tag tags) #"[, ;\.\^\*\/]+")
         '()))))

(defn from-user-ex [user user-ex]
  (let [bare-ex {:title (:title user-ex)
                 :duration (parse-duration (:duration user-ex))
                 :sport (:sport user-ex)
                 :creationDate (parse-time (:date user-ex))
                 :lastModifiedDate (parse-time (:date user-ex))
                 :user user}
        body (if (nil? (:body user-ex)) "" (:body user-ex)) ;; disallow nil body
        tags (parse-tags (:tags user-ex))
        ;avghr (if (positive-numbers? (list (:avghr user-ex))) (int (:avghr user-ex)) nil)
        distance (parse-distance (:distance user-ex))]
    (-> bare-ex
        (assoc :body body)
        (assoc :tags tags)
        (assoc :distance distance)
        (assoc :avghr 0) ;; How to not insert if avghr nil?
        (assoc :comments '()))))

(defn create-ex [params]
  (let [user (:user params)
        ret  (mc/insert-and-return EXERCISE (from-user-ex user params))]
    (.debug logger (format "User %s created an ex %s " user ret))
    (insert-exercise-inmem-index ret)
    ret))
          
(defn comment-ex [ex-id params]
  (mc/update-by-id EXERCISE
                   (ObjectId. ex-id)
                   {"$push" {:comments {:user (:user params) :text (:text params)}}}))