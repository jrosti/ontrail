(defproject s3 "0.0.1"
  :description "S3 service"
  :dependencies [
                 [org.clojure/clojure "1.6.0"]
                 [org.clojure/data.json "0.2.5"]
                 [com.lambdaworks/scrypt "1.3.3"]
                 [org.clojure/clojure "1.6.0"]
                 [com.novemberain/monger "2.0.0"]
                 [org.slf4j/slf4j-api "1.6.4"]
                 [http-kit "2.1.19"]
                 [ring "1.3.1"]
                 [ring/ring-servlet "1.3.1"]
                 [compojure "1.2.1"]
                 [clj-aws-s3 "0.3.10"]
                ]
  :aot  [s3.core]
  :main s3.core)
