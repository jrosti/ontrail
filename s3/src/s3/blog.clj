(ns s3.blog
  (:use [s3 log mongodb parser formats])
  (:require
            [monger.collection :as mc]
            [monger.result :as mr]
            [monger.query :as mq]
            [monger.conversion]
            [clj-time.core :as time]
            [clj-time.local :as local]
            ;; for date serialization to mongo.
            [monger.joda-time])
  (:import [org.bson.types ObjectId]))

(use-logging)

(defn _id-to-id [mongo-object]
  (let [id (str (:_id mongo-object))]
    (-> mongo-object (dissoc :_id) (assoc :id id))))

(defn create-draft [user]
  (_id-to-id (mc/insert-and-return *db* BLOG {:draft true :user user})))

(defn own? [user dbo]
  (= user (:user dbo)))

(defn transform-using [params transform-rules]
  (let [dropped (apply dissoc params (:drop transform-rules))
        tf-fns (:transform transform-rules)
        transformed (merge dropped (reduce (fn [m [key transform]]
                                             (assoc m key (transform (key dropped))))
                                             {}
                                             (select-keys
                                              tf-fns
                                              (vec (clojure.set/intersection (set (keys dropped)) (set (keys tf-fns)))))))]
    (if (every? identity ((apply juxt (:validation transform-rules)) transformed))
      transformed
      (error "cannot validate blog object" params))))

(def from-db-transform
  {:drop []
   :transform {:distance to-human-distance
               :time to-human-time}
   :validation [identity]})

(defn from-db-to-user [obj]
  (-> obj (transform-using from-db-transform) _id-to-id))

(defn insert-and-return [new-dbo dbo]
  (when new-dbo
    (let [updated (merge dbo new-dbo)]
      (mc/update-by-id *db* BLOG (:_id dbo) updated)
      (from-db-to-user updated))))

(def to-db-transform
  {:drop [:id]
   :transform {:distance parse-distance
               :time parse-duration}
   :validation [:user #(-> % :draft nil? not)]})

(defn find-dbo [id]
  (mc/find-one-as-map *db* BLOG {:_id (ObjectId. id)}))

(defn create [user params]
  (let [blog (assoc params :user user)
        id (:id blog)
        dbo (find-dbo id)]
    (if (and (not= nil dbo) (own? user dbo))
      (-> blog
          (transform-using to-db-transform)
          (insert-and-return dbo))
      (error "Refusing to create" user blog dbo))))

(defn get [id]
  (from-db-to-user (find-dbo id)))