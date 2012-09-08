(ns ontrail.test.nlp
  (:use [ontrail.nlp])
  (:use [clojure.test]))

(deftest verb-from-sport
  (is (= "pyöräili" (get-verb "Pyöräily")) "UI forms finnish sentences, and it requires modifying word body"))

(deftest unknown-verb-from-sport
  (is (= "harrasti lajia kyykkä" (get-verb "Kyykkä")) "A sport, where we do not know actual verb."))