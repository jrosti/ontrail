(defproject ontrail "0.0.1"
  :description "Logs on my trails"
  :dependencies [[org.clojure/clojure "1.4.0"]
                 [aleph "0.3.0-alpha3"]
                 [ring/ring-core "[0.2.0,)"]
                 [net.cgrand/moustache "1.1.0"]
                 [enlive "1.0.0"]
		 [lamina "0.5.0-alpha4"]
		 [sandbar/sandbar "0.3.0"]
                 [com.novemberain/monger "1.1.2"]
		 [org.clojure/data.json "0.1.3"]]
  :run-aliases {:import ontrail.import}
  :main ontrail.core)

