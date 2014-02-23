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
    (is (= {"$or" [{:k "a"} {:k "b"} {:k "c"}]} (or-filter :k "a,b,c"))
        "comma separated values are applied to or"))

(deftest monger-ranges
  (is (= {:distance {"$lt" "42195"}} (to-monger-range identity :lt_distance "42195"))
      "conversion to less than with identity mapper for value"))



