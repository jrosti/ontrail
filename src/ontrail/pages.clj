(ns ontrail.pages
  (:use [compojure.core :only (defroutes PUT GET POST DELETE)])
  (:require 
   [ontrail.exercise :as ex]
   [ontrail.webutil :as webutil]
   [ontrail.auth :as auth]
   [hiccup.core :as hiccup]
   [stencil.core :as stencil]
   ))

(defn head [title]
  [:head 
   [:link {:rel "stylesheet" :href "/s/simple.css"}]
   [:title title]])

(defn details-table [ex]
  [:table 
   [:tr [:th "Laji"] [:th "Aika"] [:th "Matka"] [:th "Vauhti"]]  
   [:tr [:td (:sport ex)] [:td (:duration ex)] [:td (:distance ex)]  [:td (:pace ex)]]])
  
(defn latest-list-entry [ex]
  [:div.listEntry
   [:h2 [:a {:href (str "/ex/" (:id ex))} (:title ex)]]
   [:p (str (:user ex) " " (:date ex))]
   (details-table ex)])

(defn as-link [page]
  [:a {:href (str "/latest/" page)} (str page " ")])

(defn latest-paging [page current-count]
  (let [pages 1
        next-pages (if (> current-count 0) (range (inc page) (+ page (inc pages))) [])
        start-page (- page pages)
        prev-pages (if (> start-page 0) (range start-page page) (range 1 page))]
    (vec (conj (concat (map as-link prev-pages) [[:span (str " " page " ")]] (map as-link next-pages)) :div))))

;; Complete HTML Pages

(defn single-exercise [ex]
  [:html 
   (head (:title ex))
   [:body
    [:div#exHead
     [:h2 (:title ex)]
     [:img.avatar {:src (:avatar ex)}]
     [:p (:user ex)]]
     [:p (:date ex)]]
    [:div#exDetail
     (details-table ex)
     ]
    [:div#exBody (:body ex)]])

(defn latest [page res]
   [:html 
    (head(str "ontrail.net :: " page))
    [:body 
     (latest-paging page (count res))
     (for [entry res] (latest-list-entry entry))
     (latest-paging page (count res))
     ]])

(defmacro render-with [render-fn data & [status]]
  `(try 
     {:status (or ~status 200)
      :headers {"Content-Type" "text/html"}
      :body (hiccup/html (~render-fn ~data))}
     (catch Exception exception#
       {:status 500
        :headers {"Content-Type" "text/html"}
        :body (str exception#)})))

(defroutes templates

  (GET "/latest/:page" {params :params cookies :cookies}
       (let [page (Integer/parseInt ^String (webutil/get-page params))]
         (render-with (partial latest page)
                      (ex/get-latest-ex-list-default-order (auth/user-from-cookie cookies) {} page))))
  
  (GET "/ex/:id" {params :params cookies :cookies}
       (render-with single-exercise  
                    (ex/get-ex (auth/user-from-cookie cookies) (:id params))))       

  
  )
  
