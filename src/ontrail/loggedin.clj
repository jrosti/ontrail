(ns ontrail.loggedin
	(:require [ontrail.profile :as profile]
			  [ontrail.user :as user]
			  [ontrail.group :as group]
			  [ontrail.tagsummary :as tagsummary]
			  [ontrail.newcomment :as nc]
			  [ontrail.system :as system]
			  [ontrail.nlp :as nlp]
			  ))


(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn params[user]
	(.info logger (str "logged in for " user))
	(let [user-map (user/get-user user)]
		{
		 :profile (:profile user-map)
		 :email (:email user-map)
		 :avatarUrl (user/get-avatar-url user)
		 :ownGroups (group/own-as-list user)
		 :ownTags (tagsummary/get-distinct-tags {:user user})
		 :sports nlp/sports
		 }))

(defn system[] 
	{:activeUsers (nc/active-users)
	 :systemstats (system/stats)
	})