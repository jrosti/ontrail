(ns ontrail.pages
  (:use [compojure.core :only (defroutes PUT GET POST DELETE)])
  (:require [stencil.core :as stencil]))

(defroutes templates

  (GET "/view/hello" []
       {:status 200
        :headers {"Content-Type" "text/html"}
        :body (stencil/render-file "hello" {:name "Peppi"})})
  
  )
  
