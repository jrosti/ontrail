(ns ontrail.test.import
  (:use [ontrail.import])
  (:use [clojure.test]))

(require '[net.cgrand.enlive-html :as html])

(deftest to-duration-basic
  (is (= 360000 (to-duration "60,0")) "60,0 minutes is 360000 hundreds of seconds"))

(def lenkkivihko-import-html "<html><head><meta http-equiv=Content-Type content=\"text/html; charset=utf-8\"></head><body><table>
 <thead><tr><th>Päivä</th><th>Otsikko</th><th>Tuntemukset</th><th>Laji</th><th>Kesto (min)</th><th>Matka (km)</th><th>Syke (bpm)</th><th>Nopeus (min/km)</th><th>Tagit</th> </tr></thead>
<tbody>
 <tr class=\"even\"><td>29.11.2010</td><td><a href=\"/username/saunalenkki_0\">Saunalenkki</a></td><td>Juoksu</td><td><p>
Juoksin pienen hien ja menin saunomaan.  
</p>
</td><td>30,0000000</td><td>0,0</td><td>0</td><td>-</td><td></td> </tr>
</tbody>
</table>
</body></html>")

(deftest parse-ex-from-lenkkivihko-html
  (let [imported (html/html-resource (java.io.StringReader. lenkkivihko-import-html))
        exercises (get-exercises imported)]
    (is (= 1 (count exercises)) "There is one exercise in the import")
    (is (is-ex? (first exercises)))
    (let [first-ex (get-exercise (first exercises))]
      (is (= "Juoksu" (get-or-create-sport first-ex)))
      (is (= 180000 (get-duration first-ex))))))
    

