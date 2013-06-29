(defproject ontrail "0.0.1"
  :description "A training blog."
  :dependencies [[org.clojure/clojure "1.5.1"]
  		[com.draines/postal "1.9.2"]
                [aleph "0.3.0-beta15"]
                [compojure "1.1.5"]
                [ring "1.1.6"]
                [clj-time "0.4.4"]
                [enlive "1.0.1"]
                [clj-json "0.4.3"]
		[org.clojure/core.memoize "0.5.6"]
                [org.clojure/data.json "0.1.3"]
                [com.lambdaworks/scrypt "1.3.3"]
                [lamina "0.5.0-beta15"]
                [org.slf4j/slf4j-api "1.6.4"]
                [ch.qos.logback/logback-classic "1.0.3"]
                [commons-codec/commons-codec "1.6"]
                [com.novemberain/monger "1.5.0-rc1"]
                [cheshire "5.0.2"]
                [ring.middleware.logger "0.2.2"]
                ]
  :run-aliases {:import ontrail.import
                :create-user ontrail.user
                :import-images ontrail.imgimport}
  :main ontrail.core)

