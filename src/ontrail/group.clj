(ns ontrail.group
  (:use monger.operators
        ontrail.mongodb)
  (:require [monger.collection :as mc]
            [monger.result :as mr]
            [monger.query :as mq]
            [monger.conversion]
            [clj-time.core :as time]
            [monger.joda-time])
  (:import [org.bson.types ObjectId]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn in [x xs]
  (some #{x} xs))

(defn add-group [group-name description]
	(mc/insert-and-return GROUPS {:name group-name :description description :users [] :lname (.toLowerCase group-name)}))

(defn find-by-name [group-name]
  (mc/find-one-as-map GROUPS {:name group-name}))

(defn do-group-user-op [oper valid-oper? group-name user]
  (if (or (nil? user) (= "nobody" user) (nil? group-name))
      {:result false :descr (str "User is not allowed to join" user group-name)}
      (if-let [group (mc/find-one-as-map GROUPS {:name group-name})]
        (if (valid-oper? user (:users group))
          {:result false :descr (str "User op invalid for the g:" group-name " u:" user)}
          {:result (mr/ok? (mc/update-by-id GROUPS (:_id group) {oper {:users user}})) :descr (str "DB update g:" group-name " u:" user)})
        {:result false :descr "Group does not exist"})))

(defn join-to [group-name user]
  (do-group-user-op $push (fn [user users] (in user users)) group-name user))

(defn part-from [group-name user]
  (do-group-user-op $pull (fn [user users] (not= (in user users))) group-name user))

(defn decorate [user entry]
  (let [e (dissoc entry :_id)]
    (if (in user (:users e))
      (assoc e :in true)
      (assoc e :in false))))

(defn as-list [page user]
  (.info logger (str page "::" user))
  (let [results (mq/with-collection GROUPS
                (mq/find {})
                (mq/paginate :page (Integer/valueOf page) :per-page 20)
                (mq/sort {:lname 1}))]
    {:groups (vec (map (partial decorate user) results))}))
