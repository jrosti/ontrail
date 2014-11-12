(ns s3.loggedin
  (:require [s3.user :as user]
            [s3.nlp :as nlp]
            )
  (:use [s3 log]))

(use-logging)

(defn params [user]
  (let [user-map (user/get-user user)]
    {
     :email (:email user-map)
     :avatarUrl (user/get-avatar-url user)
     :sports nlp/sports
     :user user
     }))

