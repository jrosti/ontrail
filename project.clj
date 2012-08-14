(defproject ontrail "0.0.1"
  :description "Logs on my trails"
  :dependencies [[org.clojure/clojure "1.3.0"]
                 [postgresql/postgresql "8.4-702.jdbc4"]
                 [org.clojure/java.jdbc "0.1.1"]
                 [ring/ring-jetty-adapter "0.3.10"]
                 [sandbar/sandbar "0.3.0"]
                 [compojure "0.6.4"]
                 [enlive "1.0.0"]]
  :run-aliases {:createdb ontrail.createdb
                :import ontrail.import}
  :main ontrail.core)

