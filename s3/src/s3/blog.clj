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

(defn own? [user dbo]
  (= user (:user dbo)))

(defn transform-using [blog transform-rules]
  (let [dropped (apply dissoc blog (:drop transform-rules))
        tf-fns (:transform transform-rules)
        transformed (merge dropped (reduce (fn [m [key transform]]
                                             (assoc m key (transform (key dropped))))
                                             {}
                                             (select-keys
                                                tf-fns
                                                (vec (clojure.set/intersection (set (keys dropped))
                                                                               (set (keys tf-fns)))))))]
    (if (every? identity ((apply juxt (:validation transform-rules)) transformed))
      transformed
      (error "cannot validate blog object" blog))))

(def from-db-to-user-transform
  {:drop []
   :transform {:distance to-human-distance
               :time to-human-time}
   :validation [identity]})

(defn from-db-to-user [obj]
  (-> obj (transform-using from-db-to-user-transform) _id-to-id))

(defn insert-and-return [new-dbo dbo]
  (when new-dbo
    (let [updated (merge dbo new-dbo)]
      (mc/update-by-id *db* BLOG (:_id dbo) updated)
      (from-db-to-user updated))))

(def from-user-to-db-transform
  {:drop [:id]
   :transform {:distance #(-> % parse-distance int)
               :time #(-> % parse-duration int)}
   :validation [:user #(-> % :draft nil? not)]})

(defn find-blog-object [id]
  (mc/find-one-as-map *db* BLOG {:_id (ObjectId. id)}))

(defn create-new-draft [user]
  (_id-to-id (mc/insert-and-return *db* BLOG {:draft true :user user})))

(defn update [user blog]
  (let [new-blog (assoc blog :user user)
        id (:id new-blog)
        db-object (find-blog-object id)]
    (if (and (not= nil db-object) (own? user db-object))
      (-> new-blog
          (transform-using from-user-to-db-transform)
          (insert-and-return db-object))
      (error "Db object deleted or not own. Refusing to update" user new-blog db-object))))

(defn find-by [id]
  (from-db-to-user (find-blog-object id)))

(defn delete-by [id])

(defn list-by [rules])
