(ns ontrail.test.mongerfilter
  (:use [clojure.test]
        [ontrail.mongerfilter])
  (:require [clj-time.core :as time]))

(deftest numeric-conversions
  (is (= 42195 ((value-conversion-fun :distance) "42195"))
      ":distance is converted to numeric value")
  (is (= "42195" ((value-conversion-fun :title) "42195"))
      ":title is not converted"))

(deftest create-or-filter
    (is (= {"$or" [{:k "a"} {:k "b"} {:k "c"}]} 
           (or-filter :k "a,b,c"))
        "comma separated values are applied to or"))

(deftest monger-ranges
  (is (= {:distance {"$lt" "42195"}} 
         (to-monger-range identity :lt_distance "42195"))
      "conversion to less than with identity mapper for value"))

(deftest date-range-test
  (let [[{date :creationDate}] (make-range-query identity 
                              {:lt_creationDate 
                               "3.1973"})]
    (is (= ["$lt"] (keys date)) "extracted :creationDate keyword")
    (is (= ["3.1973"] (vals date)) "extracted creationDate value")))

(deftest make-query-test
  (let [query {:user "Esko" :sport "Juoksu,Hiihto"
               :gte_pace "5000" :lt_avghr "150"
               :sb "+creationDate"}]
    (is (= {"$and" [{"$or" [{:sport "Juoksu"} {:sport "Hiihto"}]} 
                    {:user "Esko"} {:avghr {"$lt" 150}} 
                    {:pace {"$gte" 5000}}]}
           (make-query-from query))
      "query extracted from query params")
    (is (= {:creationDate 1, :lastModifiedDate -1} 
           (sortby query))
        "sort order extracted from query")))
  
(deftest make-group-query-test 
  (let [group-fn (fn[_] {:users ["Esko" "Matti"]})]
    (is (= [{"$or" [{:user "Esko"} {:user "Matti"}]}]
           (make-group-query group-fn "group-name")))
    "make-group-query returns filter that applies to all users in a group."))
