(ns ontrail.import
  (:use ontrail.mongodb ontrail.user))

(require '[monger.collection :as mc]
         '[net.cgrand.enlive-html :as html]
         '[clojure.string :as string]
         '[clj-time.core :as time]
         ;; for date serialization to mongo.
         '[monger.joda-time])

(defn import-html [filename]
  (html/html-resource (java.io.FileReader. filename)))

(defn get-exercises [imported-html]
  "First one is a heading, so choose rest of TR-elements."
  (rest (html/select imported-html [:tr])))

(defn is-ex? [ex-html]
  "Hackish way to select <tr> elements, which are actual exercises."
  (= 10 (count (get ex-html :content))))

(defn get-exercise [ex-html]
  "Array of <TD></TD> -elements is the content."
  (get ex-html :content))

(defn convert-to-timestamp [date-string]
  "Input format: 12.08.2012"
  (let [date-array (map #(read-string (str "10r" %)) (string/split date-string #"\."))]
    (time/date-time (nth date-array 2) (second date-array) (first date-array))))

(defn get-timestamp [exercise]
  (convert-to-timestamp (html/text (nth exercise 0))))

(defn get-heading [exercise] (html/text (nth exercise 1)))

(defn get-or-create-sport [exercise]
  ;; XXX: todo this properly.
  (let [sport-id (html/text (nth exercise 2))
        _sport-id (mc/find-one ONSPORT {:_id sport-id})]
    (if (= nil _sport-id) (mc/insert ONSPORT {:_id sport-id}))
    sport-id))

(defn get-report [exercise]
  "Emits the html in report and joins all strings in it."
  (let [as-html (reduce #(str %1 %2) (html/emit* (nth exercise 3)))
        as-html-wotd (string/replace as-html #"^<td>" "")]
    (string/replace as-html #"</td>$" "")))

(defn get-distance [exercise]
  "Returns meters. Input: 42,195, output 41295"
  (let [distance-string (html/text (nth exercise 5))]
    (int (* 1000 (read-string (string/replace distance-string #"," "."))))))

(defn to-duration [duration-string]
  "Input format: 14 400,12 is 14400.12 minutes"
  (let [duration-dotted (string/replace duration-string #"," ".")
        minutes (read-string (string/replace duration-dotted " " ""))]
    (int (* 6000 minutes))))

(defn get-duration [exercise]
  "Unit: 1/100 seconds integer"
  (let [duration-string (html/text (nth exercise 4))]
    (to-duration duration-string)))

(defn get-avghr [exercise]
  (int (read-string (html/text (nth exercise 6)))))

(defn get-tags [exercise]
  "Import implementation stores either empty string or one tag per ex. Now tag is a list of strings."
  (let [one-tag (string/trim (html/text (nth exercise 8)))]
    (if (= "" one-tag)
      '()
      (list one-tag))))

(defn insert [login-id exercise]
  (mc/insert EXERCISE
                  {:date (get-timestamp exercise),
                   :user login-id,
                   :sport (get-or-create-sport exercise),
                   :duration (get-duration exercise),
                   :distance (get-distance exercise),
                   :avghr (get-avghr exercise),
                   :elevation 0,
                   :heading (get-heading exercise),
                   :body (get-report exercise),
                   :tags (get-tags exercise)
                   }))

(defn import-user-and-file [username filename]
  (let [imported-html (import-html filename)]
    (map #(if (is-ex? %)
            (insert username (get-exercise %))
            -1)
         (get-exercises imported-html))))

(defn -main [& args]
  "Imports lenkkivihko.fi export format. First arg is an username, and the second export filename."
  (let [[username password email import-file & rest] args]
    (println (str "Creating user " username " with import data file " import-file))
    (create-user username password email)
    (import-user-and-file username import-file)))
