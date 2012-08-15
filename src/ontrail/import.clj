(ns ontrail.import)
(use '[ontrail.core :only (db)])

(require '[clojure.java.jdbc :as sql])
(require '[net.cgrand.enlive-html :as html])

(def import-html (html/html-resource (java.io.FileReader. "peppi-trainlog.html")))

(def exs (rest (html/select import-html [:tr])))

(defn is-ex? [ex-html]
	(= 10 (count (get ex-html :content))))

(defn get-ex [ex-html]
	(get ex-html :content))

(defn convert-to-timestamp [date-string]
	"Input format: 12.08.2012"
	(let [date-array (map #(read-string (str "10r" %)) (clojure.string/split date-string #"\."))]
		(java.sql.Timestamp. (.getTime (java.util.Date. (- (nth date-array 2) 1900) 
														(+ 1 (second date-array)) 
														(first date-array) 12 0)))))

(defn get-uid [name] 
	(sql/with-connection db
		(sql/with-query-results results ["select id from onuser where name = ?" name] 
			(get (first results) :id))))

(defn get-timestamp [ex] (convert-to-timestamp (html/text (nth ex 0))))
(defn get-heading [ex] (html/text (nth ex 1)))

(defn get-sport [ex] 
	(let [sport (html/text (nth ex 2))]
		(sql/with-connection db 
			(sql/with-query-results results ["select id from sport where name = ?" sport]
			 (if (> (count results) 0) (get (first results) :id) 0)))))


(defn get-report [ex] (html/text (nth ex 3)))

(defn get-distance [ex]
	"Returns meters. Input: 42,195km"
	(let [distance-string (html/text (nth ex 5))]
		(int (* 1000 (read-string (clojure.string/replace distance-string #"," "."))))))

(defn to-duration [duration-string]
	"Input format: 14 400,12 is 14400.12 minutes"
	(let [duration-dotted (clojure.string/replace duration-string #"," ".")
		  minutes (read-string (clojure.string/replace duration-dotted " " ""))]
		  (int (* 6000 (read-string duration-string)))))

(defn get-duration [ex]
	"Unit: 1/100 seconds integer"
	(let [duration-string (html/text (nth ex 4))]
		(to-duration duration-string)))

(defn get-avghr [ex]
	(int (read-string (html/text (nth ex 6)))))

(defn get-tags [ex]
	(html/text (nth ex 8)))

(defn insert-sql [uid timestamp heading report duration distance avghr tags sport] 
	(sql/with-connection db
		(sql/insert-values :exs
			[:uid :date :heading :report :duration :distance :avghr :tags :sport] 
			[uid timestamp heading report duration distance avghr tags sport])))

(defn insert [uid excercise]
	(dorun [(try
				(insert-sql uid
					(get-timestamp excercise) 
					(get-heading excercise) 
					(get-report excercise) 
					(get-duration excercise)
					(get-distance excercise)
					(get-avghr excercise)
					(get-tags excercise)
					(get-sport excercise))
			(catch Exception e 
				(prn uid e excercise)))]))

(defn -main []
	(let [uid (get-uid "peppi")]
		(try
			(doall (map #(if (is-ex? %) (insert uid (get-ex %))) exs))
		(catch Exception e (prn e)))))
