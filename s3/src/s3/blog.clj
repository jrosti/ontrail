(ns s3.blog
  (:use
        [s3 log mongodb parser formats utils user])
  (:require [monger.collection :as mc]
            [s3.mongoquery :as querystr]
            [monger.result :as mr]
            [monger.query :as mq]
            [monger.conversion]
            [clojure.string :as string]
            [clj-time.core :as time]
            [clj-time.local :as local]
            ;; for date serialization to mongo.
            [monger.joda-time])
  (:import [org.bson.types ObjectId]))

(use-logging)

(defn _id-to-id [mongo-object]
  (when mongo-object
    (let [id (str (:_id mongo-object))]
      (-> mongo-object (dissoc :_id) (assoc :id id)))))

(defn id-to-sid [mongo-object]
  (when mongo-object
    (-> mongo-object (assoc :sid (:id mongo-object)))))

(defn own? [user dbo]
  (= user (:user dbo)))

(defn transform-fields-using [blog transform-rules]
  (let [dropped (apply dissoc blog (:drop transform-rules))
        tf-fns (:transform transform-rules)
        transforms (reduce (fn [m [key transform]]
                             (assoc m key (transform (key dropped))))
                           {}
                           (select-keys
                             tf-fns
                             (vec (clojure.set/intersection (set (keys dropped))
                                                            (set (keys tf-fns))))))
        transformed (merge dropped transforms)]
    (if (every? identity ((apply juxt (:validation transform-rules)) transformed))
      transformed
      (error "cannot validate blog object" blog))))

(def from-db-to-user-transform
  {:drop []
   :transform {:distance to-human-distance
               :time #(if (not= 0 %) (to-human-time %) "")}
   :validation [identity]})

(defn from-db-to-user [obj]
  (-> obj (transform-fields-using from-db-to-user-transform) _id-to-id))

(defn insert-and-return [new-dbo dbo]
  (when new-dbo
    (let [updated (merge dbo new-dbo)]
      (mc/update-by-id *db* BLOG (:_id dbo) updated)
      (from-db-to-user updated))))

(def from-user-to-db-transform
  {:drop [:id :avatar]
   :transform {:distance #(-> % parse-distance int)
               :time #(-> % parse-duration int)
               :draft #(if (string? %) (parse-boolean %) (boolean %))}
   :validation [:user #(-> % :draft string? not)]})

(defn object-id [id]
  (try
    (ObjectId. id)
    (catch Exception e
      (error (.getMessage e)))))

(defn find-blog-object [id]
  (mc/find-one-as-map *db* BLOG {:_id (object-id id)}))

(defn find-blog-object-by-sid [seo-id]
  (when seo-id
    (mc/find-one-as-map *db* BLOG {:sid seo-id})))

(defn query [page rules sort-order]
  (mq/with-collection
    *db* BLOG
    (mq/find rules)
    (mq/paginate :page page :per-page 10)
    (mq/sort sort-order)))

(defn generate-gravatar [blog]
  (when blog
    (assoc blog :avatar (get-avatar-url (:user blog)))))

(defn list-result [user page rules sort-order]
  {:blogs (->> (query page rules sort-order)
               (map from-db-to-user)
               (map generate-gravatar))
   :page page
   :viewer user
   :sortedBy sort-order})

(defn pad-with [text padding]
  (let [text-part (truncate text 40)
        pad-count (+ 3 (max 0 (- (count padding) (count text))))
        pad (->> padding reverse (take pad-count) (apply str))]
    (str text-part "_" pad)))

(defn generate-seo-id [blog padding]
  (let [title (:title blog)
        try-pad (-> title
                    to-lower
                    (string/replace #"ä" "a")
                    (string/replace #"ö" "o")
                    (string/replace #"[^a-z0-9]" "_")
                    (pad-with padding))]
    (if (not (find-blog-object-by-sid try-pad))
      (assoc blog :sid try-pad)
      (assoc blog :sid (str try-pad padding)))))

(defn generate-title [blog]
  (when blog
    (if (and (-> blog :title string?) (> (-> blog :title count) 1))
      blog
      (let [b (:body blog)
            text (strip-html b)
            text-wo-nl (string/replace text #"\n" " ")
            sentences (string/split text-wo-nl #"\.")]
        (assoc blog :title (truncate (first sentences) 150))))))

(defn create-new-draft [user]
  (_id-to-id
    (mc/insert-and-return *db* BLOG {:draft true :user user})))

(defn update-draft [user params]
  (let [new-draft (assoc params :user user :draft true)
        id (:id new-draft)
        db-object (find-blog-object id)
        swap-merge (fn [a b] (merge b a))]
    (if (and (not= nil db-object) (own? user db-object))
      (-> new-draft
          (transform-fields-using from-user-to-db-transform)
          (swap-merge db-object)
          (generate-title)
          (insert-and-return db-object)
          (generate-gravatar))
      (error "Db object deleted or not own. Refusing to update: " user params id))))

(defn get-draft [user id]
  (let [obj (find-blog-object id)
        user-obj (from-db-to-user obj)]
    (if (and (:draft obj) (= user (:user obj)))
      (if obj
        (-> user-obj
            generate-gravatar))
      (error "Cannot view draft. Not found or not owned by user" user id))))

(defn generate-publication-date [blog]
  (when blog
    (assoc blog :published (local/local-now))))

(defn publish [user params]
  (let [id (:id params)
        db-object (find-blog-object id)
        new-blog (assoc db-object :draft false)]
    (if (and (not= nil db-object) (own? user db-object))
      (-> new-blog
          (generate-title)
          (generate-seo-id id)
          (generate-publication-date)
          (insert-and-return db-object)
          (generate-gravatar))
      (error "Db object deleted or not own. Refusing to update: " user new-blog id))))

(defn find-by-id [user id]
  (let [obj (find-blog-object id)
        user-obj (from-db-to-user obj)]
    (if obj
      (if (not (:draft obj))
        (-> user-obj
            (generate-gravatar))
        (error "Cannot view draft " user id))
      (error "Object not found" user id))))

(defn find-by [user sid]
  (let [obj (find-blog-object-by-sid sid)
        user-obj (from-db-to-user obj)]
    (if obj
      (if (not (:draft obj))
        (-> user-obj
            (generate-gravatar))
        (error "Cannot view draft" user sid))
      (find-by-id user sid))))

(defn delete-by [user id]
  (let [db-object (find-blog-object-by-sid id)
        oid (:_id db-object)]
    (if (and (not= nil db-object) (own? user db-object))
      {:id id
       :result (do (mc/insert *db* BLOG_DEL db-object)
                   (mr/ok? (mc/remove-by-id *db* BLOG oid)))
       :user user}
      (error "Db object deleted or not own. Refusing to delete: " user oid))))


(defn list-by [user params]
  (let [page (parse-int (params :page "1"))
        rules (merge (querystr/make-query-from params) {:draft false})
        sort-order (querystr/sort-results-by params)]
    (list-result user page rules sort-order)))

(defn list-drafts [user params]
  (let [page (parse-int (params :page "1"))
        rules {:user user :draft true}
        sort-order (querystr/sort-results-by params)]
    (list-result user page rules sort-order)))