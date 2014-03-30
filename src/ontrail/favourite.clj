(ns ontrail.favourite 
  (:require [monger.collection :as mc]))

(defn commenters [ex]
  (->> ex :comments (map :user))) 

(defn observe [ex]
  (for [commenter (commenters ex) writer [(:user ex)]]
    [commenter writer]))

(defn all-pairs []
  (apply concat (filter (comp not empty?) (map observe (mc/find-maps "exercise" {})))))

(defn assoc-count [accumulator pair]
  (if-let [v (accumulator pair)]
    (update-in accumulator [pair] inc)
    (assoc accumulator pair 1)))

(defn reduce-counts []
  (reduce assoc-count {} (all-pairs)))

(def reduce-counts-memo
  (memoize reduce-counts))

(defn users [] 
  (->> (mc/find-maps "onuser" {}) 
       (map :username)))

(def users-memo
  (memoize users))

(defn count-comments-with [xfn counts user] 
  (->> (users-memo)
       (map (fn [u] (if-let [v (counts (xfn [user u]))] {:to u :count v} nil)))
       (filter identity)
       (sort-by :count >)))

(def count-comments-from 
  (partial count-comments-with identity))

(def count-comments-to 
  (partial count-comments-with reverse))

(defn favourites-of [user]
  (->> (count-comments-from  (reduce-counts-memo) user)
       (map :to) 
       (filter #(not= user %))
       (filter  #(not= "admin" %))
       (take 18)))
  
