(ns ontrail.pages
  (:use [compojure.core :only (defroutes PUT GET POST DELETE)])
  (:require 
   [ontrail.nlp :as nlp]
   [ontrail.utils :as utils]
   [ontrail.exercise :as ex]
   [ontrail.mutate :as mutate]
   [ontrail.webutil :as webutil]
   [ontrail.auth :as auth]
   [hiccup.core :as hiccup]
   [stencil.core :as stencil]
   [clojure.string :as string]
   ))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn truncate 
  ([str] 
     (truncate str 50))
  ([str n]
     (subs str 0 (min (count str) n))))

(defn topmenu []
  [:div.topmenu [:p.menu [:a {:href "/latest/1"} "Viimeisimmät"] [:a {:href "/addex"} "Lisää lenkki"]]])

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
   [:h2.listHead [:a.exLink {:href (str "/ex/" (:id ex))} (:title ex)]]
   [:p [:span.date (:date ex)] " " [:span.user (str (:user ex)) ]]
   (details-table ex)
   [:div.shortEx (-> ex :body utils/strip-html truncate)]
   [:div.comments [:p [:span (str (:commentCount ex) " kommenttia")]]]
   ])

(defn as-link [page]
  [:a.naviLink {:href (str "/latest/" page)} (str page)])

(defn latest-paging [page current-count]
  (let [pages 1
        next-pages (if (> current-count 0) (range (inc page) (+ page (inc pages))) [])
        start-page (- page pages)
        prev-pages (if (> start-page 0) (range start-page page) (range 1 page))
        p  (vec (conj (concat (map as-link prev-pages) [[:span (str " " page " ")]] (map as-link next-pages)) :div))]
    (.info logger (str "page" (vec next-pages) "count::" current-count " p:: " p))
    p))

;; Complete HTML Pages

(defn single-exercise [ex]
  [:html 
   (head (:title ex))
   [:body
    (topmenu)
    [:div#exHead
     [:h2 (:title ex)]
     [:img.avatar {:src (:avatar ex)}]
     [:p.username (:user ex)]]
     [:p.date (:date ex)]
    [:div#exDetail.exDetail (details-table ex)]
    [:div#exBody (:body ex)]
    [:div.commentContainer
     [:h3.commentHeading "Kommentit"]
     (for [comment (reverse (:comments ex))]
       [:div 
        [:img.avatar.commentAvatar {:src (:avatar comment)}]
        [:p [:span.date (:date comment)] " " [:span.user (str (:user comment)) ]]
        [:p (:body comment)]])]]])

(defn addex [_]
  [:html
   (head "Kirjoita viesti")
   [:body
    (topmenu)
    [:h2 "Lisää uusi suoritus"]
    [:form {:method "POST" :action "/addex"}
     [:input {:name "title"}]
     [:select {:name "sport"}
      [:option {:value "Juoksu"} "Juoksu"]
      [:option {:value "Pyöräily"} "Pyöräily"]]
     [:input {:name "duration"}]
     [:input {:name "distance"}]
     [:input {:name "date"}]
     [:input {:type "submit" :value "Lisää lenkki"}]

     ]]])
              
(defn latest [page res]
   [:html 
    (head (str "ontrail.net :: " page))
    [:body 
     (topmenu)
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
                      (ex/get-latest-ex-list-default-order 
                       (auth/user-from-cookie cookies) 
                       {} page))))
  
  (GET "/ex/:id" {params :params cookies :cookies}
       (render-with single-exercise  
                    (ex/get-ex (auth/user-from-cookie cookies) (:id params))))       

  (GET "/addex" {params :params cookies :cookies}
       (render-with addex {}))

  (POST "/addex" {params :params cookies :cookies}
        (if (auth/valid-auth-token? (:value (cookies "authToken")))
          (let [posted (mutate/create-ex (auth/user-from-cookie cookies) params)]
            {:status 301
             :headers {"Content-Type" "text/html"
                       "Location" (str "/ex/" (:id  posted))}
             :body ""})
          {:status 301
           :headers {"Content-Type" "text/html"
                     "Location" "/s/login.html"}
           :body ""}))
  
  )
  
