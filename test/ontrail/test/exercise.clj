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