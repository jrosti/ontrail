(defproject ontrail "0.0.1"
  :description "Logs on my trails"
  :dependencies [[org.clojure/clojure "1.3.0"]
                 [ring/ring-jetty-adapter "0.3.10"]
                 [sandbar/sandbar "0.3.0"]
                 [compojure "0.6.4"]
                 [enlive "1.0.0"]
                 [com.novemberain/monger "1.1.2"]]
  :run-aliases {:import ontrail.import}
  :main ontrail.core)

