(ns ontrail.mutate
  (:use [ontrail mongodb search exercise user formats parser readcount])
  (:require [monger.collection :as mc]
            [monger.result :as mr]
            [monger.query :as mq]
            [monger.conversion]
            [clj-time.core :as time]
            ;; for date serialization to mongo.
            [monger.joda-time])
  (:import [org.bson.types ObjectId]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn from-user-ex [user user-ex]
  (let [now (time/now)
        creation-date (parse-date (:date user-ex))
        last-modified (if (> (time/in-minutes (time/interval (parse-date (:date user-ex)) (time/plus now (time/days 1)))) 43200)
                        creation-date
                        now)
        bare-ex {:title (:title user-ex)
                 :duration (parse-duration (:duration user-ex))
                 :sport (:sport user-ex)
                 :creationDate creation-date
                 :lastModifiedDate last-modified
                 :user user}
        body (if (nil? (:body user-ex)) "" (:body user-ex))
        tags (parse-tags (:tags user-ex))
        avghr (parse-natural (:avghr user-ex))
        distance (parse-distance (:distance user-ex) (:duration bare-ex)]
    (-> bare-ex
        (assoc :body body)
        (assoc :tags tags)
        (assoc :distance distance)
        (assoc :avghr avghr) 
        (assoc :comments '()))))

(defn delete-ex [user ex-id]
  (.trace logger (str "deleting " user " ex " ex-id))
  (let [ex (mc/find-one-as-map EXERCISE {:_id (ObjectId. ex-id)})
        ex-user (:user ex)
        exists? (identity ex)]
    (if (and exists? (= user ex-user))
      (let [delete-ok? (mr/ok? (mc/remove-by-id EXERCISE (ObjectId. ex-id)))]
        {:result delete-ok? :message (str user" deleted " " exercise " ex-id) :type "ex" :id ex-id})
        {:result false :message (str "refused-to-delete " user " " ex-id " user-ex [" ex-user "] ex-exists? " exists?)})))

(defn delete-own-comment [user ex-id comment-id]
  (.trace logger (str user " deleting own comment " comment-id " from ex " ex-id ))
  (mc/update-by-id EXERCISE
    (ObjectId. ex-id)
    { "$set" {:lastModifiedDate (time/now)}
      "$pull" {:comments {:_id (ObjectId. comment-id) :user user}}})
  (get-ex ex-id))

(defn delete-own-ex-comment [user ex-id comment-id]
  (.trace logger (str user " deleting comment " comment-id " from own ex " ex-id))
  (mc/update-by-id EXERCISE
    (ObjectId. ex-id)
    { "$set" {:lastModifiedDate (time/now)}
      "$pull" {:comments {:_id (ObjectId. comment-id)}}})
  (get-ex ex-id))

(defn create-ex [user params]
  (.debug logger (str (:user params) " creating ex " params))
  (let [ret  (mc/insert-and-return EXERCISE (from-user-ex user params))
        str-id (str (:_id ret))]
    (insert-exercise-inmem-index ret)
    (.trace logger (str (:user params) " created ex " ret " with id " str-id))
    (as-ex-result zero-fun ret)))

(defn update-ex [user params]
  (.trace logger (str (:user params) " updating ex " params))
  (let [write-result (mc/update-by-id EXERCISE (ObjectId. (:id params))
                                      {"$set" (dissoc (from-user-ex user params)
                                                      :comments
                                                      :lastModifiedDate)})]
    (.debug logger (str "Updated " (:id params) " with status "  write-result)))
  (let [res (mc/find-one-as-map EXERCISE {:_id (ObjectId. (:id params))})]
    (.debug logger (str (:id params) res))
    (as-ex-result zero-fun res)))

(defn comment-ex [user params]
  (.trace logger (str user " creating comment " params))
  (mc/update-by-id EXERCISE
                   (ObjectId. (:id params))
                   {"$set" {:lastModifiedDate (time/now)}
                    "$push" {:comments {:_id (ObjectId.)
                                        :avatar (get-avatar-url user)
                                        :date (to-human-comment-date (time/now))
                                        :user user
                                        :body (:body params)}}})
  (.debug logger (str user " created comment " params))
  (cc-comment-ex (:id params))
  (get-ex (:id params)))