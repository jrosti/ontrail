(ns ontrail.emails
  (:require [postal.core :as postal]
            [clojure.stacktrace :as stacktrace]))

(def #^{:private true} logger (org.slf4j.LoggerFactory/getLogger (str *ns*)))

(def ^:const admin "jari.rosti@gmail.com")

(defn reg-body [user]
  (str "Hei " user "!\n\n"
       "Tervetuloa käyttämään Ontrailia!\n\n"

       "Ontrailin ylläpidon tavoittaa Facebook-ryhmässä: https://www.facebook.com/groups/ontrail/\n"
       "tai lähettämällä sähköpostia osoitteeseen ontrail@ontrail.net\n\n"

       "Yleisimmin kysyttyihin kysymyksiin löydät vastauksia ylläpitäjän sivuilta ontrailista osoitteesta\n\n"
       "http://ontrail.net/#user/admin\n\n"

       "--\nYstävällisin terveisin, Ontrail-tiimi"))

(defn send-register-msg [user email]
  (try
    (future (.info logger (str (postal/send-message {:from    "ontrail@ontrail.net"
                                                     :to      [email]
                                                     :cc      [admin]
                                                     :subject "Tervetuloa Ontrailiin!"
                                                     :body    (reg-body user)}))))
    (catch Exception exception
           (.error logger (str exception))
           (stacktrace/print-stack-trace exception 100)
           nil)))