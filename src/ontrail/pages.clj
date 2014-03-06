(ns ontrail.pages
  (:use [compojure.core :only (defroutes PUT GET POST DELETE)])
  (:require 
   [ontrail.nlp :as nlp]
   [ontrail.utils :as utils]
   [ontrail.exercise :as ex]
   [ontrail.mutate :as mutate]
   [ontrail.webutil :as webutil]
   [ontrail.auth :as auth]

   [hiccup.form :as form]
   [hiccup.core :as hiccup]
   [stencil.core :as stencil]
   [clojure.string :as string]
   ))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(defn url[& parts] 
  (apply (partial str "/sp") parts))

(defn parse-int [^String int-str]
  (try
    (Integer/parseInt int-str)
    (catch Exception e
      0)))

(defn truncate 
  ([str] 
     (truncate str 100))
  ([str n]
     (subs str 0 (min (count str) n))))

(defmacro render-with [render-fn data & [status]]
  `(try 
     {:status (or ~status 200)
      :headers {"Content-Type" "text/html"}
      :body (hiccup/html (~render-fn ~data))}
     (catch Exception exception#
       {:status 500
        :headers {"Content-Type" "text/html"}
        :body (str exception#)})))

(defn to-dur-str [params]
  (str (parse-int (:duration.h params)) "h"
       (parse-int (:duration.m params)) "m"
       (parse-int (:duration.s params)) "s"))

(defn redirect [page]
  {:status 301
   :headers {"Content-Type" "text/html"
             "Location" page}
   :body ""})

(defn topmenu []
  [:nav.topmenu [:a.addexLink {:href (url "/addex")} "Lisää lenkki"]])

(defn current-user [user]
  (if (= "nobody" user) 
    [:div.currentUser [:a {:href "/s/login.html"} "Kirjaudu"]]
    [:div.currentUser [:p.currentUser user]]))

(defn logo []
  [:div.logo [:a {:href (url "/latest/1")} [:img {:src "/img/logo.png"}]]])

(defn head [title]
  [:head 
   [:link {:rel "stylesheet" :href "/s/simple.css"}]
   [:title title]])

(defn row [value]
  [:tr.detailsTd [:td.detailsTr value]])

(defn details-table [ex]
  [:table.details 
   (row (:sport ex)) 
   (row (:duration ex))
   (row (:distance ex)) 
   (row (:pace ex))
   (row (:avghr ex))])

(defn action [ex]
  (str (:user ex) " " (:did ex) " "  (:duration ex) 
       (if (and (:distance ex) (not= (:distance ex) "")) 
         (str (:distance ex) " vauhdilla " (:pace ex)) "")))

(defn latest-list-entry [ex]
  [:article.listEntry
   [:a.exLink {:href (url "/ex/" (:id ex))}
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
  [:a.naviLink {:href (url "/latest/" page)} (str page)])

(defn latest-paging [page current-count]
  (let [pages 1
        next-pages (if (> current-count 0) (range (inc page) (+ page (inc pages))) [])
        start-page (- page pages)
        prev-pages (if (> start-page 0) (range start-page page) (range 1 page))
        navigation  (vec (conj (concat (interpose [:span "&nbsp;&nbsp;"] (map as-link prev-pages)) 
                                       [[:span.currentPage (str " " page " ")]] 
                                       (interpose [:span "&nbsp;&nbsp;"] (map as-link next-pages))) :div.pageNavi))]
    navigation))

(defn header [user]
  [:header
   (current-user user)
   (logo)
   (topmenu)])


(defn comment-div [id]
  [:div.postComment 
   [:form {:method "POST" :action (url "/comment/" id)}
    [:input {:type "hidden" :name id}]
    [:textarea {:name "body" :rows "2" :cols "25"}] [:br]
    [:input {:type "submit" :value "Kommentoi"}]
   ]])


(defn single-exercise [{ex :ex user :user}]
  [:html 
   (head (:title ex))
   [:body
    (header user)
    [:article.articleHeading
     [:h2 (:title ex)] 
     [:img.avatar {:src (str (:avatar ex) "&s=150")}]
     [:p.username (:user ex)]
     [:p.date (:date ex)]
     [:div#exDetail.exDetail (details-table ex)]]
    [:article.body (:body ex)]
    (comment-div (:id ex))
    [:div.commentContainer
     [:h3.commentHeading "Kommentit"]
     (for [comment (reverse (:comments ex))]
       [:article.comment 
        [:img.avatar {:src (str (:avatar comment) "&s=30")}]
        [:div.commentDiv 
         [:p [:span.date (:date comment)] " " [:span.user (str (:user comment)) ]]
         [:p.commentBody (:body comment)]]])]]])



(defn span-w [text]
  [:span.fieldDescription text])

(defn addex [{params :params user :user sports :sports}]
  [:html
   (head "Lisää")
   [:body
    (header user)
    [:h2 "Lisää uusi suoritus"]
    [:form {:method "POST" :action (url "/addex")}
     (span-w "Otsikko: ") [:input {:name "title"}] [:br]
     (span-w "Laji: ") [:select {:name "sport" :required "required"}
      (form/select-options sports)
      ] 
     [:br]
     (span-w "Aika: ")
     [:input {:name "duration.h" :type "number" :max "99" :min "0"}] "h"
     [:input {:name "duration.m" :type "number" :max "59" :min "0"}] "m"
     [:input {:name "duration.s" :type "number" :max "59" :min "0"}] "s" [:br]
     (span-w "Syke: ") [:input {:name "avghr" :type "number" :min "0" :max "200"}] [:br]
     (span-w "Matka: ") [:input {:name "distance"}] [:br]
     (span-w "Päivä: ") [:input {:name "date" :type "date" :value "today"}] [:br]
     "Kuvaus:" [:br]
     [:textarea {:name "body" :rows "8" :cols "25"}]
     [:input {:type "submit" :value "Lisää lenkki"}]

     ]]])
              
(defn latest [page {res :exs user :user}]
   [:html 
    (head (str "ontrail.net :: " page))
    [:body 
     (header user)
     (latest-paging page (count res))
     (for [entry res] (latest-list-entry entry))
     (latest-paging page (count res))
     ]])


(defroutes templates

  (GET "/sp/latest/:page" {params :params cookies :cookies}
       (let [page (Integer/parseInt ^String (webutil/get-page params))
             user (auth/user-from-cookie cookies)]
         (render-with (partial latest page)
                      {:exs (ex/get-latest-ex-list-default-order 
                             user
                             {} 
                             page)
                       :user user})))
  
  (GET "/sp/ex/:id" {params :params cookies :cookies}
       (let [user (auth/user-from-cookie cookies)]
         (render-with single-exercise  
                      {:ex (ex/get-ex user (:id params)) :user user})))       

  (POST "/sp/comment/:id" {params :params cookies :cookies}
        (if (auth/valid-auth-token? (:value (cookies "authToken")))                 
          (let [user (auth/user-from-cookie cookies)
                comment (mutate/comment-ex user params)]
            (redirect (url "/ex/" (:id params))))
          (redirect "/sp/login.html")))

  (GET "/sp/addex" {params :params cookies :cookies} ;;addex
       (let [user (auth/user-from-cookie cookies)]
         (render-with addex {:params params :sports nlp/sports :user user})))

  (POST "/sp/addex" {params :params cookies :cookies}
        (if (auth/valid-auth-token? (:value (cookies "authToken")))
          (let [params-with-dur (assoc params :duration (to-dur-str params))
                posted (mutate/create-ex (auth/user-from-cookie cookies) params-with-dur)]
            (redirect (url "/sp/ex/" (:id  posted))))
          (redirect "/s/login.html")))

  (GET "/sp" {cookies :cookies}
       (if (not= "nobody" (auth/user-from-cookie cookies))
         (redirect "/sp/latest/1")
         (redirect "/sp/login.html")))
         
  
  )
  
