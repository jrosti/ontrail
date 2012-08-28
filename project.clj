(defproject ontrail "0.0.1"
  :description "Logs on my trails"
  :dependencies [[org.clojure/clojure "1.3.0"]
                 [aleph "0.3.0-alpha2"]
                 [compojure "1.1.1"]
                 [ring "1.1.0-beta2"]
                 [lein-swank "1.4.4"]
                 [clj-time "0.4.4"]
                 [enlive "1.0.0"]
                 [clj-json "0.2.0"]
                 [org.clojure/clojure-contrib "1.2.0"]
                 [ring/ring-jetty-adapter "0.2.5"]
                 [ring-json-params "0.1.0"]
                 [org.clojure/data.json "0.1.3"]
                 [com.lambdaworks/scrypt "1.3.3"]
                 [com.novemberain/monger "1.1.2"]]
  :run-aliases {:import ontrail.import}
  :main ontrail.core)

