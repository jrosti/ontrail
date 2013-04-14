(ns ontrail.group
  (:use monger.operators)
  (:require [monger.collection :as mc]
            [monger.result :as mr]
            [monger.query :as mq]
            [monger.conversion]
            [clj-time.core :as time]
            [monger.joda-time])
  (:import [org.bson.types ObjectId]))

(def GROUPS "groups")

(defn add-group [group-name description]
	(mc/insert-and-return GROUPS {:name group-name :description description :users [] :lname (.toLowerCase group-name)}))

(defn do-group-user-op [oper valid-oper? group-name user]
  (if (or (nil? user) (= "nobody" user) (nil? group-name))
      {:result false :descr (str "User is not allowed to join" user group-name)}
      (if-let [group (mc/find-one-as-map GROUPS {:name group-name})]
        (if (valid-oper? user (:users group))
          {:result false :descr (str "User is in the g:" group-name " u:" user)}
          {:result (mr/ok? (mc/update-by-id GROUPS (:_id group) {oper {:users user}})) :descr (str "DB update g:" group-name " u:" user)})
        {:result false :descr "Group does not exist"})))

(defn join-to [group-name user]
  (do-group-user-op $push (fn [user users] (some #{user} users)) group-name user))

(defn part-from [group-name user]
  (do-group-user-op $pull (fn [user users] (not= (some #{user} users))) group-name user))

(defn list-groups [page]
  (let [results (mq/with-collection GROUPS
                (mq/find {})
                (mq/paginate :page (Integer/valueOf page) :per-page 20)
                (mq/sort {:lname 1}))]
    {:groups (vec (map #(dissoc % :_id) results))}))