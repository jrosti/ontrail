(ns ontrail.test.mongerfilter
  (:use [clojure.test]
        [ontrail.mongerfilter])
  (:require [clj-time.core :as time]))

(deftest numeric-conversions
  (is (= 42195 ((value-conversion-fun :distance) "42195"))
      ":distance is converted to numeric value")
  (is (= "42195" ((value-conversion-fun :title) "42195"))
      ":title is not converted"))

;; (or-filter :k "a,b,c")
;; => {"$or" [{:k "a"} {:k "b"} {:k "c"}]}
(deftest create-or-filter
  (let [or-test (or-filter :kw "a,b,c")
        values (or-test "$or")]
    (is (= 3 (count values))
        "three distinct values are extracted from key-value pair")
    (is (every? identity (map :kw values))
        "every value contains keyword :kw")
    (is (= #{"a" "b" "c"} (set (map :kw values)))
        "values a, b, c are extracted from kw")))

(deftest monger-range-lt
  (is (= {:distance {"$lt" "42195"}} (to-monger-range identity :lt_distance "42195"))
      "conversion to less than"))

