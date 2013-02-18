(defproject ontrail "0.0.1"
  :description "A training blog."
  :dependencies [[org.clojure/clojure "1.4.0"]
  		          [com.draines/postal "1.9.0"]
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
                [lein-js "0.1.1-SNAPSHOT"]
                [org.slf4j/slf4j-api "1.6.4"]
                [ch.qos.logback/logback-classic "1.0.3"]
                [commons-codec/commons-codec "1.6"]
                [com.novemberain/monger "1.1.2"]
                [ring.middleware.logger "0.2.2"]]
  :run-aliases {:import ontrail.import
                :create-user ontrail.user
                :import-images ontrail.imgimport}
  :main ontrail.core
  ;:resource-paths ["extra-resources"]
  :js {:src "resources/public/js" :deploy "resources/public/minjs"
       :bundles ["min.js" ["handlebars-1.0.0.beta.6.js" "handlebars-helpers.js" "icanhaz-0.10.0.js" 
                           "jquery.address-1.5-30680d.min.js" "jquery.chosen.0.9.8.min.js" "jquery.continuous-calendar.js" 
                           "jquery.cookie.js" "jquery.md5.js" "lodash-1.0.0.rc3.js" "ontrail-ui.js" "ontrail.js" "plugins.js"
                           "rx-vsdoc.js" "rx.aggregates-vsdoc.js" "rx.aggregates.min.js" "rx.binding-vsdoc.js" "rx.binding.min.js" 
                           "rx.coincidence-vsdoc.js" "rx.coincidence.min.js" "rx.experimental-vsdoc.js" "rx.experimental.min.js" 
                           "rx.joinpatterns-vsdoc.js" "rx.joinpatterns.min.js" "rx.jquery.min.js" "rx.min.js" "rx.ontrail.backend.js" 
                           "rx.ontrail.jquery.js" "rx.ontrail.js" "rx.ontrail.pager.js" "rx.ontrail.session.js" "rx.ontrail.validation.js" 
                           "rx.testing-vsdoc.js" "rx.testing.min.js" "rx.time-vsdoc.js" "rx.time.min.js" "script.js" 
                           "select2.min.js" "xdate-0.7.js"]]})

