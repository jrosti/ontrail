(ns ontrail.utils)

(defn float= [x y]
  (<= (Math/abs (- x y)) 0.00001))

(defn not-nil? [val]
  (not= val nil))

(defn positive-numbers? [vals]
  ;; XXX why lambda is needed? and is macro?
  (reduce #(and %1 %2) (map #(and (not-nil? %) (> % 0)) vals)))