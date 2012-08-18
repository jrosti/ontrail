(ns ontrail.queries
  (:use [monger.core :only [command]]
        [monger.result :only [ok?]]
        [monger.conversion :only [from-db-object]]))

(use 'ontrail.mongodb)

(def js-reduce "function(obj, prev) { prev.totaldistance += obj.distance; prev.totalduration += obj.duration }")

;; Example of db.group -command
;; db.exercise.group({cond: {user: "username"}, reduce: function(obj, prev) { prev.csum += obj.distance }, initial: {csum: 0 }});
;; condition e.g. :user user
(defn get-total-distance-and-time [condition]
  (from-db-object (command {:group {:ns "exercise"
                                    :cond condition 
                                    :$reduce js-reduce
                                    :initial {:totaldistance 0 :totalduration 0}}}))
