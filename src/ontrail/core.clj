(ns ontrail.core
  (:use lamina.core
        aleph.http
        compojure.core
        ; This sets the correct file type for js includes used by hiccup
        (ring.middleware resource file-info)
        (hiccup core page))
  (:require [compojure.route :as route])
  (:gen-class))

(require '[monger.collection :as mc])
(require '[clojure.string])

(use '[clojure.data.json :only (read-json json-str)])

(defn chat-init [ch]
  "Initialize a new chat channel"
  (receive-all ch #(println "message: " %)))

(defn chat-handler [ch room]
  "Relays messages into a chat room. If it doesn't
  exist create a new channel"
  (let [chat (named-channel room chat-init)]
    (siphon chat ch)
    (siphon ch chat)))

(defn page []
  "HTML page rendered using Hiccup. Includes the css and js for websockets."
  (html5
   [:head
    (include-css "/static/stylesheets/master.css")]
   [:body
    [:div.container
     [:div.row
      [:div.columns.twelve
        [:p [:h1#headline "Chat"]]
        [:form
          [:input#message {:type "text"}]
          [:input.nice.large.blue.button {:type "submit"}]]
        [:div#messages]]]]
    (include-js "http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js")
    (include-js "/static/javascripts/web_socket.js")
    (include-js "/static/javascripts/app.js")]))

;; XXX: Following is take from  https://github.com/alexkehayias/clojure-aleph-chat and related blog post
;; for a seed for creating channels.

(defn sync-app [request]
  "Rendered response of the chat page"
  {:status 200
   :headers {"content-type" "text/html"}
   :body (page)})


(def wrapped-sync-app
  "Wraps the response with static files"
  (-> sync-app
      (wrap-resource "public")
      (wrap-file-info)))

(defn chat [ch request]
  "View handler that handles a chat room. If it's not
  a websocket request then return a rendered html response."
  (let [params (:route-params request)
        room (:room params)]
    (if (:websocket request)
      (chat-handler ch room)
      (enqueue ch (wrapped-sync-app request)))))

(def user-handler
  {:status  200
   :headers {"Content-Type" "text/html"}
   :body    "Hello"})

(defroutes app-routes
  "Routes requests to their handler function. Captures dynamic variables."
  (GET ["/chat/:room", :room #"[a-zA-Z]+"] {}
       (wrap-aleph-handler chat))
  (GET ["/"] {} user-handler)
  ;;Route our public resources like css and js to the static url
  (route/resources "/static")
  ;;Any url without a route handler will be served this response
  (route/not-found "Page not found"))

(defn -main [& args]
  "Main thread for the server which starts an async server with
  all the routes we specified and is websocket ready."
  (start-http-server (wrap-ring-handler app-routes)
                     {:host "localhost" :port 8080 :websocket true}))
