(ns ontrail.mutate
  (:use [ontrail mongodb search exercise user formats parser newcomment])
  (:require [ontrail.sportsummary :as sportsummary]
            [ontrail.websocket :as websocket]
            [monger.collection :as mc]
            [monger.result :as mr]
            [monger.query :as mq]
            [monger.conversion]
            [clj-time.core :as time]
            [clj-time.local :as local]
            ;; for date serialization to mongo.
            [monger.joda-time])
  (:import [org.bson.types ObjectId]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn calc-pace [duration distance]
    (try
      (int (Math/round (* (/ distance  duration) 360000.0)))
    (catch Exception exception
      (.info logger (str exception " with " duration distance))
      nil)))

(defn get-last-modified [creation-date]
  (let [now (time/now)]
    (try
      (if (> (time/in-minutes (time/interval creation-date now)) 
             43200)
        creation-date
        now)
      (catch Exception ex
        (.info logger (str creation-date " in future"))
        now))))

(defn positive-short [^String input] 
  (try 
    (let [value (Short/valueOf input)] 
      (if (>= value 0)
        value
        nil))
    (catch Exception ex
      (.trace logger (str "[" input "] cannot parse as short integer"))
      nil)))

;; { :detail.a "12" :detail.b "" } -> { :detail.a 12 }
(defn extract-details [db-ex user-ex] 
  (let [detail-keys (filter (fn [detail-key] 
                              (.startsWith (name detail-key) "detail"))
                            (keys user-ex))]
    (reduce (fn [ex keyword]
              (if-let [value (positive-short (user-ex keyword))]
                (assoc ex keyword value)
                ex))
            db-ex
            detail-keys)))

(defn from-user-ex [user user-ex]
  (let [creation-date (parse-date (:date user-ex))
        last-modified (get-last-modified creation-date) 
        duration (parse-duration (:duration user-ex)) 
        bare-ex {:duration duration
                 :sport (:sport user-ex)
                 :title (if (> (count (:title user-ex)) 0) (:title user-ex) (:sport user-ex))
                 :creationDate creation-date
                 :lastModifiedDate last-modified
                 :user user}
        body (if (nil? (:body user-ex)) "" (:body user-ex))
        tags (parse-tags (:tags user-ex))
        avghr (parse-natural (:avghr user-ex))
        distance (parse-distance (:distance user-ex))
        pace (calc-pace duration distance)
        with-details (extract-details bare-ex user-ex)
        with-markdown-body (if-let [mdbody (:mdbody user-ex)]
                             (assoc with-details :mdbody mdbody)
                             with-details)]
    (-> with-markdown-body
        (assoc :body body)
        (assoc :tags tags)
        (assoc :distance distance)
        (assoc :avghr avghr) 
        (assoc :comments '())
        (assoc :pace pace))))

(defn delete-ex [user ex-id]
  (.trace logger (str "deleting " user " ex " ex-id))
  (let [ex (mc/find-one-as-map *db* EXERCISE {:_id (ObjectId. ex-id)})
        ex-user (:user ex)
        exists? (identity ex)]
    (if (and exists? (= user ex-user))
      (let [delete-ok? (mr/ok? (mc/remove-by-id *db* EXERCISE (ObjectId. ex-id)))]
        (sportsummary/reset-memo-for user)
        {:result delete-ok? :message (str user" deleted " " exercise " ex-id) :type "ex" :id ex-id})
        {:result false :message (str "refused-to-delete " user " " ex-id " user-ex [" ex-user "] ex-exists? " exists?)})))

(defn create-ex [user params]
  (.trace logger (str (:user params) " creating ex " (dissoc params :body)))
  (let [ex  (mc/insert-and-return *db* EXERCISE (from-user-ex user params))
        str-id (str (:_id ex))]
    (insert-exercise-inmem-index! ex)
    (sportsummary/reset-memo-for user)
    (websocket/submit :create-ex user ex)
    (.trace logger (str (:user params) " created ex " ex " with id " str-id))
    (as-ex-result ex)))

(defn update-ex [user params]
  (.trace logger (str (:user params) " updating ex " params))
  (let [ex (mc/find-and-modify *db* EXERCISE 
                               {:_id (ObjectId. (:id params)) :user user}
                               {"$set" (dissoc (from-user-ex user params)
                                               :comments
                                               :lastModifiedDate)}
                               {:return-new true})]
    (sportsummary/reset-memo-for user)
    (.info logger (str user " updated " (:id params)))
    (as-ex-result ex)))

(defn comment-ex [user params]
  (.trace logger (str user " creating comment " params))
  (let [ex (mc/find-and-modify *db* EXERCISE
                               {:_id (ObjectId. (:id params))}
                               {"$set" {:lastModifiedDate (time/now)}
                                "$push" {:comments {:_id (ObjectId.)
                                                    :avatar (get-avatar-url user)
                                                    :date (to-human-comment-date (local/local-now))
                                                    :user user
                                                    :body (:body params)}}}
                               {:return-new true})]
    (.info logger (str user " created comment " params))
    (newcount-comment-ex user (:id params))
    (insert-exercise-inmem-index! ex)
    (websocket/submit :comment-ex user ex)
    (as-ex-result ex)))

(defn care-ex [user params]
  (.trace logger (str user " creating comment " params))
  (let [ex (mc/find-and-modify *db* EXERCISE
                               {:_id (ObjectId. (:id params))}
                               {"$addToSet" {:cares {:avatar (get-avatar-url user)
                                                     :user user}}}
                               {:return-new true})]
    (.info logger (str user " cares " params))
    (websocket/submit :cares-ex user ex)
    (as-ex-result ex)))

(defn delete-comment[ex-id rule]
  (newcount-uncomment-ex ex-id)
  (let [ex (mc/find-and-modify *db* EXERCISE
                               {:_id (ObjectId. ex-id)}
                               { "$set" {:lastModifiedDate (time/now)}
                                 "$pull" rule}
                               {:return-new true})]
    (as-ex-result ex)))

(defn delete-own-comment [user ex-id comment-id]
  (.trace logger (str user " deleting own comment " comment-id " from ex " ex-id ))
  (delete-comment ex-id {:comments {:_id (ObjectId. comment-id) :user user}}))

(defn delete-own-ex-comment [user ex-id comment-id]
  (.trace logger (str user " deleting comment " comment-id " from own ex " ex-id))
  (let [ex (get-ex "zxcv" ex-id)]
    (if (= (:user ex) user)
      (delete-comment ex-id {:comments {:_id (ObjectId. comment-id)}})
      (.error logger (str user " trying to delete " comment-id " from ex " ex-id )))))
      
    
