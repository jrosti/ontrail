(defproject ontrail "0.0.1"
  :description "A training blog."
  :dependencies [
                 [org.clojure/clojure "1.6.0"]
                 [digest "1.4.4"]
                 [com.draines/postal "1.11.1"]
                 [aleph "0.3.3"]
                 [compojure "1.2.0"]
                 [stencil "0.3.4"]	   
                 [ring "1.3.1"]
                 [clj-time "0.8.0"]
                 [enlive "1.1.5"]
                 [org.clojure/core.memoize "0.5.6"]
                 [org.clojure/data.json "0.2.5"]
                 [com.lambdaworks/scrypt "1.3.3"]
                 [lamina "0.5.4"]
                 [org.slf4j/slf4j-api "1.6.4"]
                 [ch.qos.logback/logback-classic "1.0.3"]
                 [commons-codec/commons-codec "1.6"]
                 [com.novemberain/monger "2.0.0"]
                 [cheshire "5.3.1"]
                 [ring.middleware.logger "0.2.2"]
                 [hiccup "1.0.5"]
                 [markdown-clj "0.9.41"]
                ]
  :plugins [[lein-ring "0.8.10"]]
  :ring {:handler ontrail.core/app}
  :aliases {"import" ["run" "-m" "ontrail.heiaimport/import-json"]}
  :aot  [ontrail.core]
  :javac-target "1.6"
  :java-source-paths ["src/main/java" "src/test/java"]
  :main ontrail.core)

