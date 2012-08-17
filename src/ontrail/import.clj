(ns ontrail.import)

(require '[monger.core :as mg])
(require '[monger.collection :as mc])

(require '[net.cgrand.enlive-html :as html])
(require '[clojure.string])

(use 'ontrail.mongodb)

(defn import-html [filename]
  (html/html-resource (java.io.FileReader. filename)))

(defn get-exercises [imported-html]
  (rest (html/select imported-html [:tr])))

(defn is-ex? [ex-html]
  "Hackish way to select <tr> elements, which are actual exercises."
  (= 10 (count (get ex-html :content))))

(defn get-exercise [ex-html]
  "Array of <TD></TD> -elements is the content."
  (get ex-html :content))

(defn convert-to-timestamp [date-string]
  "Input format: 12.08.2012"
  (let [date-array (map #(read-string (str "10r" %)) (clojure.string/split date-string #"\."))]
    (.getTime (java.util.Date. (- (nth date-array 2) 1900) 
                               (+ 1 (second date-array)) 
                               (first date-array) 12 0))))
(defn get-uid [name] 1)

(defn get-timestamp [exercise]
  (convert-to-timestamp (html/text (nth exercise 0))))

(defn get-heading [exercise] (html/text (nth exercise 1)))

(defn get-report [exercise] 
  "Emits the html in report and joins all strings in it."
  (reduce #(str %1 %2) (html/emit* (nth exercise 3))))

(defn get-distance [exercise]
  "Returns meters. Input: 42,195, output 41295"
  (let [distance-string (html/text (nth exercise 5))]
    (int (* 1000 (read-string (clojure.string/replace distance-string #"," "."))))))

(defn to-duration [duration-string]
  "Input format: 14 400,12 is 14400.12 minutes"
  (let [duration-dotted (clojure.string/replace duration-string #"," ".")
        minutes (read-string (clojure.string/replace duration-dotted " " ""))]
    (int (* 6000 minutes))))

(defn get-duration [exercise]
  "Unit: 1/100 seconds integer"
  (let [duration-string (html/text (nth exercise 4))]
    (to-duration duration-string)))

(defn get-avghr [exercise]
  (int (read-string (html/text (nth exercise 6)))))

(defn get-tags [exercise]
  (html/text (nth exercise 8)))

(defn insert [uid exercise]
  (mc/insert "exercise"
                  {:date (get-timestamp exercise),
                   :user uid,
                   :sport 1,
                   :duration (get-duration exercise),
                   :distance (get-distance exercise),
                   :avghr (get-avghr exercise),
                   :elevation 0,
                   :heading (get-heading exercise),
                   :report (get-report exercise),
                   :tags (get-tags exercise)
                   }))

(defn -main [& args]
  "First arg is an username, and the second export filename."
  (let [uid (get-uid (first args))
        imported-html (import-html (second args))]
    (try
      (doall (map #(if (is-ex? %) (insert uid (get-exercise %))) (get-exercises imported-html)))
      (catch Exception e (prn e)))))
