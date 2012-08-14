(ns ontrail.createdb)

(require '[clojure.java.jdbc :as sql])

(def db (System/getenv "DATABASE_URL"))

(def create-exs (sql/with-connection db
		(sql/create-table :exs
			[:id :serial "PRIMARY KEY"]
			[:date :timestamp "NOT NULL"] 
			[:uid :integer]
			[:sports :integer]
			[:duration :integer]
			[:distance :integer]
			[:avghr :integer]
			[:elevation :integer]
			[:heading "varchar(128)"]
			[:report :text]
			[:tags :text]
			[:ugoperm :integer]
			)))

(def create-sports (sql/with-connection db
	(doall [(sql/create-table :sport
			[:id :serial]
			[:name "varchar(30) unique" "PRIMARY KEY"] 
			[:description :text])
		   (sql/insert-values :sport [:name] ["Juoksu"])
		   (sql/insert-values :sport [:name] ["Pyöräily"])])))
		
(def create-users (sql/with-connection db
	(doall	[(sql/create-table :onuser
			[:id :serial]
			[:name "varchar(20) unique"] 
			[:goals :text]
			[:pwdhash "varchar(20)"])
			(sql/insert-values :onuser [:name] ["peppi"])])))	

(def create-group (sql/with-connection db
	(doall 	[(sql/create-table :ongroup
			[:id :serial]
			[:name "varchar(40) unique"] 
			[:description :text])])))

(defn -main []
	(doall [create-exs create-sports create-users create-group]))