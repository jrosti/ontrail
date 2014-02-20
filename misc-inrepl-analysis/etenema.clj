(use 'clj-time.core :reload)
(use 'monger.query :reload)
(use 'ontrail.formats :reload)
(use 'ontrail.profile :reload)
(use 'ontrail.utils :reload)
(use 'clojure.java.io)
(import 'java.io.File)

(def pasi_p (get-profile "SannaK"))
(def pasiex (with-collection "exercise" (find {:user "SannaK" :sport "Juoksu"}) (sort {:creationDate 1}) (batch-size 5000)))


(defn get-bpmdist-raw2 [exercise profile]
  (let [{:keys [duration distance avghr]} exercise
        {:keys [resthr]} profile]
    (if (positive-numbers? (list resthr duration distance avghr))
      (/ distance (* (- avghr resthr) duration (double (/ 1 6000)))))))

(def b (date-time 2013 1 1))

(defn daysb [dt] (double (/ (in-minutes (interval b dt)) (* 60 24))))

(def ff
  (filter 
   (fn [ex] 
     (and (:avghr ex) (after? (:creationDate ex) 
                              b))) 
   pasiex))

(def bbm (map 
          (fn [ex]
            [(int (daysb (:creationDate ex)))
             (get-bpmdist-raw2 ex pasi_p)])
          ff))

(def o (File. "out.dat"))

(defn w[afile amap]
  (let [owriter (writer afile)]
    (mapv #(.write owriter (format "%d %f\n" (first %) (double (second %)))) amap)
    (.close owriter)))
