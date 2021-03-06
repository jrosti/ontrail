(defproject s3 "0.0.1"
  :description "S3 service"
  :dependencies [
                 [org.clojure/clojure "1.6.0"]
                 [org.clojure/data.json "0.2.5"]
                 [com.lambdaworks/scrypt "1.3.3"]
                 [org.clojure/clojure "1.6.0"]
                 [com.novemberain/monger "2.0.0"]
                 [com.taoensso/timbre "3.3.1"]
                 [http-kit "2.1.19"]
                 [ring "1.3.1"]
                 [ring/ring-servlet "1.3.1"]
                 [compojure "1.2.1"]
                 [cheshire "5.5.0"]
                 [ring/ring-json "0.3.1"]
                 [clj-time "0.8.0"]
                 [digest "1.4.4"]
                 [com.amazonaws/aws-java-sdk "1.10.17"]
                 [org.imgscalr/imgscalr-lib "4.2"]
                 [social/exif-processor "0.1.2-socialsuperstore-SNAPSHOT"]
                 ]
  :plugins [[lein-ring "0.8.13"]]
  :ring {:handler s3.core/app}
  :aot  [s3.core]
  :main s3.core)

