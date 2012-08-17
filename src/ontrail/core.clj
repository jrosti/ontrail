(ns ontrail.core)

(use 'aleph.http)
(use 'net.cgrand.moustache)
(use 'ontrail.mongodb)
(use 'lamina.core)

(defn async-handler [response-channel request]
  (enqueue response-channel
    {:status 200
     :headers {"content-type" "text/plain"}
     :body "async response"}))

(def handler 
  (app 
    ["sync"] {:get "response"}
    ["async"] {:get (wrap-aleph-handler async-handler)}))

(defn -main []
  (start-http-server (wrap-ring-handler handler) {:port 8080}))
