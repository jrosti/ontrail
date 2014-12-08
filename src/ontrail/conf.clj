(ns ontrail.conf
  (:use ontrail.utils))

(def properties-file "properties.clj")

(def default-properties
  {:hiding #{}
   :auth
   {:KEY (.getBytes "s49628MbrU8VoG8Q")
    :MACKEY (.getBytes "R4A6bX69a4NU68xK")}})

(def properties
  (if (file-exists? properties-file)
    (eval (read-string (slurp properties-file)))
    default-properties))