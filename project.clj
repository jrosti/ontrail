(defproject ontrail "0.0.1"
  :description "A training blog."
  :dependencies [[org.clojure/clojure "1.4.0"]
                 [aleph "0.3.0-alpha2"]
                 [compojure "1.1.3"]
                 [ring "1.1.6"]
                 [lein-swank "1.4.4"]
                 [clj-time "0.4.4"]
                 [enlive "1.0.0"]
                 [clj-json "0.2.0"]
                 [org.clojure/clojure-contrib "1.2.0"]
                 [ring/ring-jetty-adapter "0.2.5"]
                 [ring-json-params "0.1.0"]
                 [org.clojure/data.json "0.1.3"]
                 [com.lambdaworks/scrypt "1.3.3"]
		 [lamina "0.5.0-beta7"]
                 [org.slf4j/slf4j-api "1.6.4"]
                 [ch.qos.logback/logback-classic "1.0.3"]
                 [commons-codec/commons-codec "1.6"]
                 [com.novemberain/monger "1.1.2"]
                 [ring.middleware.logger "0.2.2"]]
  :run-aliases {:import ontrail.import
                :create-user ontrail.user}
  :main ontrail.core)

