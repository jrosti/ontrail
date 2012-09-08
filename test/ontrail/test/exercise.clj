(ns ontrail.test.exercise
  (:use ontrail.exercise
        clojure.test))

(deftest hr-reserve
  (let [ex {:avghr 142}
        prof {:resthr 42 :maxhr 192}]
    (is (= "67%" (get-heart-rate-reserve ex prof)) "Exercise combines profile and hr if exists.")))

(deftest hr-reserve-no-profile
  (let [ex {}
        prof nil]
    (is (= "" (get-heart-rate-reserve ex prof)) "No profile.")))

(deftest verb-from-sport
  (is (= "pyöräili" (get-verb "Pyöräily")) "UI forms finnish sentences, and it requires modifying word body"))

(deftest unknown-verb-from-sport
  (is (= "harrasti lajia kyykkä" (get-verb "Kyykkä")) "A sport, where we do not know actual verb."))