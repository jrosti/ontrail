(ns ontrail.core)

(require '[monger.collection :as mc])
(require '[clojure.string])

(use '[clojure.data.json :only (read-json json-str)])
(use 'aleph.http)
(use 'net.cgrand.moustache)
(use 'ontrail.mongodb)
(use 'lamina.core)

(defn async-handler [response-channel request]
  (enqueue response-channel
    {:status 200
     :headers {"content-type" "text/plain"}
     :body "async response"}))

(defn get-user-info [path-info]
  (let [user-id (clojure.string/replace path-info #"^/" "")]
    (json-str (mc/find-one "onuser" {:_id user-id}))))

(defn user-handler [req]
  {:status  200
   :headers {"Content-Type" "text/html"}
   :body    (get-user-info (get req :path-info))})

(def handler 
  (app 
    ["user" &] user-handler
    ["async"] {:get (wrap-aleph-handler async-handler)}))

(defn -main []
  (start-http-server (wrap-ring-handler handler) {:port 8080}))
