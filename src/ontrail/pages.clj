(ns ontrail.pages
  (:use [compojure.core :only (defroutes PUT GET POST DELETE)])
  (:use ontrail.utils)
  (:require
    [clojure.core.memoize :as memo]
    [ontrail.nlp :as nlp]
    [ontrail.utils :as utils]
    [ontrail.exercise :as ex]
    [ontrail.unread :as unread]
    [ontrail.mutate :as mutate]
    [ontrail.webutil :as webutil]
    [ontrail.auth :as auth]
    [ontrail.formats :as formats]
    [ontrail.mongerfilter :as mongerfilter]
    [markdown.core :as md]
    [clj-time.core :as time]
    [hiccup.form :as form]
    [hiccup.core :as hiccup]
    [stencil.core :as stencil]
    [clojure.stacktrace :as stacktrace]
    [clojure.string :as string]
    [ontrail.parser :as parser])
  (:import [java.net URLEncoder]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

;; (urlp {:a "b" :c "d"}) ===> "?a=b&c=d"
(defn urlp [params]
  (if (empty? params)
    ""
    (str "?"
         (apply str
                (interpose "&"
                           (map (fn [param]
                                  (str (-> param first name) "=" (-> param second URLEncoder/encode)))
                                params))))))

;; (url {:a "b" :c "d"} "/list/" page) ==> /sp/list/page?a=b&c=d
;; (url "latest" page) ===> /sp/latest/page
(defn url [maybe-params & parts]
  (if (map? maybe-params)
    (let [params (urlp maybe-params)]
      (apply (partial str "/sp") (concat parts [params])))
    (apply (partial str "/sp" maybe-params) parts)))

(defmacro render-with [render-fn data & [status]]
  `(try
     {:status  (or ~status 200)
      :headers {"Content-Type" "text/html"}
      :body    (str "<!DOCTYPE html>\n" (hiccup/html (~render-fn ~data)))}
     (catch Exception exception#
       (stacktrace/print-stack-trace exception#)
       {:status  500
        :headers {"Content-Type" "text/html"}
        :body    (str "E:" exception#)})))

;; {...} ===> "1h2m3s"
(defn to-dur-str [params]
  (str (parse-int (params "duration.h")) "h"
       (parse-int (params "duration.m")) "m"
       (parse-int (params "duration.s")) "s"))

(defn redirect [page]
  {:status  301
   :headers {"Content-Type" "text/html"
             "Location"     page}
   :body    ""})

(defn head [title]
  [:head
   [:link {:rel "stylesheet" :href "/s/css/font-awesome.min.css"}]
   [:link {:rel "stylesheet" :href "/s/css/froala_editor.min.css"}]
   [:link {:rel "stylesheet" :href "/s/css/froala_style.min.css"}]
   [:link {:rel "stylesheet" :href "/s/css/simple.css"}]

   [:link {:rel "stylesheet" :href "http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css"}]
   [:link {:rel "stylesheet" :href "http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap-theme.min.css"}]
   [:meta {:name "viewport" :content "width=device-width, initial-scale=1"}]
   [:meta {:http-equiv "X-UA-Compatible" :content "IE=edge"}]
   [:meta {:charset "utf-8"}]
   [:script {:src "http://code.jquery.com/jquery-1.11.1.min.js"}]
   [:script {:src "http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"}]
   [:script {:src "/s/froala_editor.min.js"}]
   [:script {:type "text/javascript"}
    "var _gaq = _gaq || [];
     _gaq.push(['_setAccount', 'UA-34593654-1']);
     _gaq.push(['_trackPageview']);
    (function() {
     var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
     ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
     var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();"]
   "<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->\n"
   "<!--[if lt IE 9]>\n"
   [:script {:src "https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"}] "\n"
   [:script {:src "https://oss.maxcdn.com/respond/1.4.2/respond.min.js"}]
   "\n<![endif]-->"
   [:title title]])

(defn action [ex]
  (str (:user ex) " " (:did ex) " "
       (if (and (:distance ex) (not= (:distance ex) ""))
         (str " " (:distance ex) " ajassa " (:duration ex) " vauhdilla " (:pace ex))
         (if (= "0 min" (:duration ex))
           ""
           (:duration ex)))))

(defn latest-list-entry [ex]
  [:div
   (if (:isNew ex) {:class "container container-article container-new"}
                   {:class "container container-article"})
   [:div.row
    [:div.col-md-8
     [:a {:href (url {:user (:user ex)} "/list/" 1)}
      [:img.profile-image.list-avatar.img-rounded.pull-left {:src (:avatar ex)}]]
     [:a {:href (url "/ex/" (:id ex))} [:h2 (:title ex)]]
     [:h4 (action ex)]]]
   [:div.row
    [:div.col-md-2
     [:h4 [:span.date (:date ex)]]]]
   [:div.row
    [:div.col-md-12
     [:p (-> ex :body utils/strip-html truncate)]
     [:a {:href (url "/ex/" (:id ex))} [:span.commentCount (str (:commentCount ex) " kommenttia"
                              (if-let [new (:newComments ex)] (str ", " new " uutta") ""))]]

     ]]
   ]
  )

(defn as-link [url-fn name page]
  [:li [:a.btn.btn-default {:href (url-fn page) :role "button"} (str name)]])

(defn latest-paging [url-fn page current-count]
  (let [pages 1
        next-pages (if (> current-count 0) (range (inc page) (+ page (inc pages))) [])
        start-page (- page pages)
        prev-pages (if (> start-page 0) (range start-page page) (range 1 page))
        navigation (vec (conj (concat
                                (map (partial as-link url-fn "edellinen") prev-pages)
                                (map (partial as-link url-fn "seuraava") next-pages)
                                ) :ul.nav.nav-pills.pull-right))]
    [:div.row [:div.col-md-12 [:p.page.pull-left (str "Sivu " page)] navigation]]))

(defn msg-counts [user]
  {:all (:count (unread/count-new :all user))
   :own (:count (unread/count-new :own user))})

(def msg-counts-memo
  (memo/ttl msg-counts :ttl/threshold (* 60 1000)))

(defn navi [user]
  (let [counts (msg-counts user)]
    [:nav.navbar.navbar-inverse.navbar-fixed-top {:role "navigation"}
     [:div.container
      [:div.navbar-header
       [:button.navbar-toggle.collapsed {:type "button" :data-toggle "collapse" :data-target "#navbar" :aria-expanded "false" :aria-controls "navbar"}
        [:span.sr-only "Toggle navigation"] [:span.icon-bar] [:span.icon-bar] [:span.icon-bar]]
       [:a.logo {:href (url "/latest/1")}
        [:img.logoImg {:src "/img/logo.png"}]]]
      [:div#navbar.navbar-collapse.collapse
       [:ul#navi.nav.navbar-nav
        [:li {:role "presentation"} [:a.navilink {:href (url "/addex")} "LISÄÄ"]]
        [:li {:role "presentation"} [:a.navilink {:href (url {:user user} "/list/" 1)} "OMAT"]]
        [:li {:role "presentation"} [:a.navilink {:href (url {:user user} "/unread/own")} (format "SEURATUT (%d)" (:own counts))]]
        [:li {:role "presentation"} [:a.navilink {:href (url {:user user} "/unread/all")} (format "UUDET (%d)" (:all counts))]]
        [:li {:role "presentation"} [:a.navilink {:href "/rest/v2/logout"} (format "Kirjaa ulos %s" user)]]
        ]]]]))


(defn footer []
  [:div.footer [:a {:href "http://ontrail.net"} "Ontrail - täysi versio"]])

(defn clear []
  [:div {:style "clear:both;"}])

(defn comment-div [id]
  [:div.container
   [:div.row
    [:div.col-md-8
     [:form {:role "form" :accept-charset "UTF-8" :method "POST" :action (url "/comment/" id)}
      [:input {:type "hidden" :name id}]
      [:div.form-group
        [:textarea.form-control {:name "mdbody" :rows "4" :required "required"}]]
      [:button.btn.btn-default {:type "submit"} "Kommentoi"]
      ]]]])

(defn row [value]
  [:tr [:td value]])

(defn details-table [ex]
  [:table.details
   (row (:sport ex))
   (row (:duration ex))
   (row (:distance ex))
   (row (:pace ex))
   (row (str (:avghr ex) " " (:hrReserve ex)))])

(defn more-details [ex]
  [:table.details
   (if-let [elevation (:detailElevation ex)]
     (row (str "Nousu: " (formats/to-human-distance elevation)))
     (row ""))
   (if-let [reps (:detailRepeats ex)] (row (str reps " toistoa")) (row ""))])

(defn comments [ex]
  (when ex
    (let [n (ex :new-count 0)]
      (map-indexed
        (fn [i c]
          (if (<= n i)
            (assoc c :new true)
            c)) (reverse (:comments ex))))))

;; renders /sp/ex/<id>
(defn single-exercise [{ex :ex user :user}]
  [:html
   (head (:title ex))
   [:body {:role "document"}
    (navi user)
     [:div.container
      [:div.row
       [:div.col-md-12
        [:h2 (:title ex)]
        [:p.date (:date ex)]
        [:a {:href (url {:user (:user ex)} "/list/" 1)}
          [:img.profile-image.img-rounded.pull-left.list-avatar {:src (str (:avatar ex) "&s=170")}]
          [:p.username (:user ex)]]
        [:div#exDetail.exDetail (details-table ex) (more-details ex)]]]
      [:div.row
       [:div.col-md-12 (:body ex)]]]
     (comment-div (:id ex))
     (if (> (:commentCount ex) 0)
       [:div.commentContainer
        [:h3.commentHeading "Kommentit"]
        (for [comment (comments ex)]
          [:div
           (if (:new comment) {:class "container container-article"}
                              {:class "container container-article container-new"})
           [:div.row
            [:div.col-md-12
             [:img.profile-image.img-rounded.pull-left {:src (str (:avatar comment) "&s=30")}]
             [:div.commentDiv
              [:p [:span.date (:date comment)] " " [:span.username (str (:user comment))]]
              [:p.commentBody (:body comment)]]]]])]
       [:div.commentContainer "Ei kommentteja"])]])

(defn today-as-form-date []
  (formats/to-form-date (time/now)))

(defn form-group
  ([id name value]
   (form-group id name value {}))
  ([id name value params]
   (let [value (if value {:value value} {})]
     [:div.form-group
      [:label {:for id} name]
      [:input.form-control (merge {:id id :name id} params value)]])))

(def selectables (map (fn [s] [s s]) nlp/sports))

(defn sports-options [selected]
  (if selected
    (form/select-options selectables selected)
    (form/select-options selectables)))

(defn to-duration [tdur]
  (if tdur
    (let [secs (quot (+ 50 tdur) 100)
          hours (quot secs 3600) mrem (rem secs 3600)
          mins (quot mrem 60) srem (rem mrem 60)
          secs srem
          to-val #(if (> % 0) {:value (str %)} {})]
      (mapv to-val [hours mins secs]))
    [{} {} {}]))

(defn addex [{ex :ex user :user}]
  (let [{detailElevation :detailElevation detailRepeats :detailRepeats id :id distance :distance tduration :tduration date :creationDate} ex
        [hval mval sval] (to-duration tduration)
        form-date (if (and ex date) (-> date parser/parse-date formats/to-form-date) (today-as-form-date))
        action (if ex (url "/addex/" id) (url "/addex"))]
    [:html
     (head (if ex "Muokkaa ""Lisää"))
     [:body {:role "document"}
      (navi user)
      [:div.container
       [:h2 (if ex "Muokkaa lenkkiä " "Lisää lenkki")]
       [:form {:role "form" :accept-charset "UTF-8" :method "POST" :action action}
        [:div {:role "tabpanel"}
         [:ul.nav.nav-tabs {:role "tablist"}
          [:li.active {:role "active"} [:a {:href "#basic" :aria-controls "basic" :role "tab" :data-toggle "tab"} "Perustiedot"]]
          [:li {:role "active"} [:a {:href "#extended" :aria-controls "basic" :role "tab" :data-toggle "tab"} "Lisätiedot"]]]
         [:div.tab-content
          [:div#basic.tab-pane.active {:role "tabpanel"}
           (form-group "title" "Otsikko" (:title ex) {:required "required"})
           [:div.form-group
            [:label {:for "sport"} "Laji"]
            [:select.form-control {:name "sport" :required "required"} (sports-options (:sport ex))]]
           [:div.form-group
            [:label "Aika"] [:br]
            [:input (merge {:align "right" :name "duration.h" :type "number" :max "99" :min "0"} hval)] "h"
            [:input (merge {:align "right" :name "duration.m" :type "number" :max "59" :min "0"} mval)] "m"
            [:input (merge {:align "right" :name "duration.s" :type "number" :max "59" :min "0"} sval)] "s" ]
           (form-group "distance" "Matka" distance {:rel "txtTooltip" :title "Lisää matka esimerkiksi muodossa 10 km, 10,3 km tai 50m." :data-toggle "tooltip" :data-placement "bottom"})
           (form-group "date" "Päivä" form-date {:type "date"})
           [:div.form-group
            [:label {:for "mdbody"} "Kuvaus"]
            [:textarea#addex.form-control {:name "mdbody" :rows "8"} (:body ex)]]]
          [:div#extended.tab-pane {:role "tabpanel"}
           (form-group "avghr" "Syke" (:avghr ex) {:type "number" :min "0" :max "200" :rel "txtTooltip" :title "Lisää harjoituksen keskisyke yksiköissä lyöntiä minuutissa." :data-toggle "tooltip" :data-placement "bottom"})
           (form-group "detailRepeats" "Toistot" detailRepeats {:type "number" :min "0" :max "99999" :rel "txtTooltip" :title "Lisää toistomäärä kokonaislukuna." :data-toggle "tooltip" :data-placement "bottom"})
           (form-group "detailElevation" "Nousumetrit" detailElevation {:type "number" :min "0" :max "99999" :rel "txtTooltip" :title "Lisää nousumetrit kokonaislukuna." :data-toggle "tooltip" :data-placement "bottom"})]]]
        [:button.btn.btn-default {:type "submit"} (if ex "Muokkaa" "Lisää lenkki")]]]
      [:script {:src "/s/sp.js"}]]]))

;; renders /sp/latest/1 and /sp/list/1?<filter-map>
;; if url-fn is nil paging is not required. 
(defn listing [url-fn page {res :exs user :user}]
  [:html
   (head (str "ontrail.net :: " page))
   [:body
    (navi user)
    (if url-fn (latest-paging url-fn page (count res)))
    (if (= 0 (count res))
      [:p.page "Ei harjoituksia"]
      (for [entry res] (latest-list-entry entry)))
    (if url-fn (latest-paging url-fn page (count res)))
    ]
   (footer)])

(defn render-listing-page [url-fn listing-fn user filter page]
  (.info logger (str filter " " page))
  (render-with (partial listing url-fn page)
               {:exs  (listing-fn user
                                  filter
                                  page)
                :user user}))

(defn login-page [_]
  [:html
   (head "Kirjaudu")
   [:body
     [:nav.navbar.navbar-inverse.navbar-fixed-top {:role "navigation"}
      [:div.container
       [:div.navbar-header
         [:img.logoImg {:src "/img/logo.png"}]]]]
    [:div.container
     [:div.row
      [:h2 "Kirjaudu"]
      [:div.col-md-8
        [:form {:role "form" :accept-charset "UTF-8" :method "POST" :action "/rest/v2/login"}
         (form-group "username" "Tunnus" nil)
         [:input.redirect {:type "hidden" :name "referer" :value "/sp/latest/1"}]
         (form-group "password" "Salasana" nil {:type "password"})
         [:button.btn.btn-default {:type "submit"} "Kirjaudu"]]]]]]])

(defmacro require-auth [cookies form]
  `(if (and (auth/valid-auth-token? (:value (~cookies "authToken"))) (not= "nobody" (auth/user-from-cookie ~cookies)))
     ~form
     (redirect "/sp/login.html")))

(defroutes templates

           (GET "/sp/login.html" [] (render-with login-page {}))

           (GET "/sp/latest/:page" {params :params cookies :cookies}
                (require-auth cookies
                  (let [page (Integer/parseInt ^String (webutil/get-page params))
                        user (auth/user-from-cookie cookies)]
                    (render-listing-page (partial url "/latest/")
                                         ex/get-latest-ex-list-default-order
                                         user
                                         {}
                                         page))))

           (GET "/sp/list/:page" {params :params cookies :cookies}
                (require-auth cookies
                  (let [page (Integer/parseInt ^String (webutil/get-page params))
                        user (auth/user-from-cookie cookies)]
                    (render-listing-page (partial url (dissoc params :page) "/list/")
                                         (fn [user filter page]
                                           (ex/get-latest-ex-list user
                                                                  filter
                                                                  page
                                                                  (mongerfilter/sortby params)))
                                         user
                                         (mongerfilter/make-query-from params)
                                         page))))

           (GET "/sp/unread/:target" {params :params cookies :cookies}
                (require-auth cookies
                  (let [user (auth/user-from-cookie cookies)
                        unread-fn (if (= (:target params) "own") unread/comments-own unread/comments-all)]
                    (render-with (partial listing nil nil)
                                 {:exs  (unread-fn user)
                                  :user user}))))

           (GET "/sp/ex/:id" {params :params cookies :cookies}
                (require-auth cookies
                  (let [user (auth/user-from-cookie cookies)]
                    (render-with single-exercise
                                 {:ex (ex/get-ex user (:id params)) :user user}))))

           (POST "/sp/comment/:id" {params :params cookies :cookies}
                 (require-auth cookies
                   (if (auth/valid-auth-token? (:value (cookies "authToken")))
                     (let [user (auth/user-from-cookie cookies)
                           with-body (assoc params :body (md/md-to-html-string (params :mdbody)))]
                       (do
                         (mutate/comment-ex user with-body)
                         (redirect (url "/ex/" (:id params)))))
                     (redirect "/sp/login.html"))))

           (GET "/sp/addex" {params :params cookies :cookies} ;;addex
                (require-auth cookies
                  (let [user (auth/user-from-cookie cookies)]
                    (render-with addex {:user user}))))

           (GET "/sp/addex/:id" {params :params cookies :cookies} ;;addex
                (require-auth cookies
                  (let [user (auth/user-from-cookie cookies)
                        ex (ex/get-ex user (:id params))]
                    (if (and ex (= user (:user ex)))
                      (render-with addex {:ex ex :user user})
                      (redirect "/sp/login.html")))))

           (POST "/sp/addex" {params :params cookies :cookies}
                 (.info logger (str params))
                 (if (auth/valid-auth-token? (:value (cookies "authToken")))
                   (let [params-with-dur (assoc params :duration (to-dur-str params) :body (params :mdbody))
                         posted (mutate/create-ex (auth/user-from-cookie cookies) params-with-dur)]
                     (redirect (url "/ex/" (:id posted))))
                   (redirect "/sp/login.html")))

           (POST "/sp/addex/:id" {params :params cookies :cookies}
                 (.info logger (str "mutating with "params))
                 (if (auth/valid-auth-token? (:value (cookies "authToken")))
                   (let [params-with-dur (assoc params :duration (to-dur-str params) :body (params :mdbody))
                         posted (mutate/update-ex (auth/user-from-cookie cookies) params-with-dur)]
                     (redirect (url "/ex/" (:id posted))))
                   (redirect "/sp/login.html")))


           (GET "/sp" {cookies :cookies}
                (if (not= "nobody" (auth/user-from-cookie cookies))
                  (redirect "/sp/latest/1")
                  (redirect "/sp/login.html"))))
  
