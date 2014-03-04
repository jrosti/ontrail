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
     (truncate str 100))
  ([str n]
     (subs str 0 (min (count str) n))))

(defn topmenu []
  [:div.topmenu [:p.menu [:a.addexLink {:href "/addex"} "Lisää lenkki"]]])

(defn current-user [user]
  (if (= "nobody" user) 
    [:div.currentUser [:a {:href "/s/login.html"} "Kirjaudu"]]
    [:div.currentUser [:p.currentUser user]]))

(defn logo []
  [:div.logo [:a {:href "/latest/1"} [:img {:src "/img/logo.png"}]]])

(defn head [title]
  [:head 
   [:link {:rel "stylesheet" :href "/s/simple.css"}]
   [:title title]])

(defn details-table [ex]
  [:table 
   [:tr [:th "Laji"] [:th "Aika"] [:th "Matka"] [:th "Vauhti"]]  
   [:tr [:td (:sport ex)] [:td (:duration ex)] [:td (:distance ex)]  [:td (:pace ex)]]])

(defn action [ex]
  (str (:user ex) " " (:did ex) " "  (:duration ex) 
       (if (and (:distance ex) (not= (:distance ex) "")) 
         (str (:distance ex) " vauhdilla " (:pace ex)) "")))

(defn latest-list-entry [ex]
  [:div.listEntry
   [:a.exLink {:href (str "/ex/" (:id ex))}
    [:img.listAvatar {:src (:avatar ex)}]
    [:div.listContent     
     [:h4.listHead  (:title ex)]
     [:p [:span.date (:date ex)] [:br] 
      (action ex) [:br]
      [:span.commentCount (str (:commentCount ex) " kommenttia" (if-let [new (:newComments ex)] (str ", " new " uutta") ""))]
      ]
     [:div.shortEx (-> ex :body utils/strip-html truncate)]]]
   ])

(defn as-link [page]
  [:a.naviLink {:href (str "/latest/" page)} (str page)])

(defn latest-paging [page current-count]
  (let [pages 2
        next-pages (if (> current-count 0) (range (inc page) (+ page (inc pages))) [])
        start-page (- page pages)
        prev-pages (if (> start-page 0) (range start-page page) (range 1 page))
        navigation  (vec (conj (concat (interpose [:span "&nbsp;&nbsp;"] (map as-link prev-pages)) 
                                       [[:span.currentPage (str " " page " ")]] 
                                       (interpose [:span "&nbsp;&nbsp;"] (map as-link next-pages))) :div.pageNavi))]
    navigation))

;; Complete HTML Pages

(defn single-exercise [{ex :ex user :user}]
  [:html 
   (head (:title ex))
   [:body
    (current-user user)
    (logo)
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

(defn addex [{params :params user :user sports :sports}]
  [:html
   (head "Kirjoita viesti")
   [:body
    (current-user user)
    (logo)
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
              
(defn latest [page {res :exs user :user}]
   [:html 
    (head (str "ontrail.net :: " page))
    [:body 
     (current-user user)
     (logo)
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
       (let [page (Integer/parseInt ^String (webutil/get-page params))
             user (auth/user-from-cookie cookies)]
         (render-with (partial latest page)
                      {:exs (ex/get-latest-ex-list-default-order 
                             user
                             {} 
                             page)
                       :user user})))
  
  (GET "/ex/:id" {params :params cookies :cookies}
       (let [user (auth/user-from-cookie cookies)]
         (render-with single-exercise  
                      {:ex (ex/get-ex user (:id params)) :user user})))       

  (GET "/addex" {params :params cookies :cookies} ;;addex
       (let [user (auth/user-from-cookie cookies)]
         (render-with addex {:params params :sports nlp/sports :user user})))

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

  (GET "/s" {cookies :cookies}
       (if (not= "nobody" (auth/user-from-cookie cookies))
            {:status 301
             :headers {"Content-Type" "text/html"
                       "Location" "/latest/1"}
             :body ""}
            {:status 301
             :headers {"Content-Type" "text/html"
                       "Location" "/s/login.html"}
             :body ""}))
         
  
  )
  
