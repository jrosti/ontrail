(ns ontrail.emails
  (:require [postal.core :as postal]
            [clojure.stacktrace :as stacktrace]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(def admin "jari.rosti@gmail.com")

(defn import-message [user fres]
  {:from "ontrail@ontrail.net"
   :to [admin]
   :subject (str "Lenkkivihko-harjoituspäiväkirjan tuonti käyttäjälle " user)
   :body (str fres)})

(defn send-import-msg [user fres]
  (try
    (.info logger (postal/send-message (import-message user fres)))
    (catch Exception exception
       (.error logger (str exception))
       (stacktrace/print-stack-trace exception 100)
       nil)))

(defn reg-body [user]
  (str "Hei " user "!\n\n"
       "Tervetuloa käyttämään Ontrailia! Olemme vielä varhaisessa kehitysvaiheessa ja palvelua kehitetään jatkuvasti,"
       "tällä hetkellä työn alla ovat viikkonäkymä, sekä kaverilistat. Palvelu saatetaan ensimmäiseen versioonsa"
       "vuoden loppuun mennnessä\n\n"
       
       "Lenkkisi varmuuskopioidaan kahdesti päivässä. Halutessasi kaikki sinuun liittyvä data poistetaan"
       "palvelimelta tai siirretään haluamassasi muodossa sinulle takaisin.\n\n" 

       "Kehitystä voit myös seurata facebook-ryhmässä: https://www.facebook.com/groups/ontrail/ Palvelun teknisiin"
       "yksityiskohtiin voin tutustua osoitteessa http://www.github.com/jrost/ontrail\n\n"

       "Jos palvelusta on jotain kysyttävää, niin voit lähettää sähköpostia suoraan meille tai liittyä facebook-ryhmään,"
       "josta voi seurata palvelun toimintaa, ominaisuuksia ja kehitystyötä lähemmin.\n\n"
       
       "Ystävällisin terveisin, Ontrail-tiimi"))
       

(defn send-register-msg [user email]
    (try
      (.info logger (str (postal/send-message {:from "ontrail@ontrail.net"
                                               :to [email]
                                               :cc [admin]
                                               :bcc "hanna_liisa@hotmail.com"
                                               :subject "Tervetuloa Ontrailiin!"
                                               :body (reg-body user) })))
      (catch Exception exception
        (.error logger (str exception))
        (stacktrace/print-stack-trace exception 100)
        nil)))