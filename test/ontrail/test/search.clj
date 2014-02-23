(ns ontrail.test.search
  (:use [ontrail.search]
        [clojure.test])
  (:require [clj-time.core :as time]
            [clj-time.coerce :as cljc])
  (:import [org.joda.time DateTime]))

(deftest term-validity
  (is (valid-term? "word") 
      "accepts ordinary word.")
  (is (not (valid-term? "s")) 
      "does not accept too short word")
  (is (not (valid-term? "ja")) 
      "does not accept too common word"))

(deftest term-tokenization
  (is (= '("hello", "world") 
       (to-term-seq "<p>Hello World!</p>"))
      "tokenization to terms strips html, finds proper words as search term, and lowercases terms."))

(def date-time (time/date-time 1990 3 22))
(def date-time-long (cljc/to-long date-time))

(def exercise {:_id "id1"
               :user "Joe"
               :title "Just a call."
               :body "<p>Hello Mike</p>"
               :comments [{:body "Hello Joe, system working?" :user "Mike_"}
                          {:body "seems to be"}]
               :lastModifiedDate date-time})

(def exercise-terms  
  ["mike" "mike_" "hello" "joe" "system" "working" "just" "call" "seems" "to" "be"])

(deftest term-list-from-exercise
  (is (every? 
       (set (exercise-to-terms exercise))
      exercise-terms)
      "terms are found from comments, body, title and user."))

(deftest inserting-term
  (let [term "search-term"
        index {term #{"id1" "id2"}}
        modified-index (insert-term assoc "id3" index term)
        new-index (insert-term assoc "id4" {} term)]
    (is (= #{"id1" "id2" "id3"} (modified-index term)) 
        "when adding new id to existing term, it is added to existing postings")
    (is (= #{"id4"} (new-index term)) 
        "when adding new term, new posting list is created")))

(deftest getting-last-modified-date
  (is (= date-time (get-last-modified-date exercise))
      "last modified date of exercise is read")
  (is (instance? DateTime (get-last-modified-date {:_id "(invalid exercise, omit error)"}))
      "if :lastModifiedDate keyword does not exist, we should get the datetime instance"))

(deftest inserting-exercise-to-index
  (let [new-index (insert-exercise-to-index assoc {} exercise)]
    (is (every?
         (fn [term] (= #{"id1"} (new-index term)))
         exercise-terms)
        "for every search term, the posting list contains single id1 exercise id")))

(deftest test-stringify
  (let [index {"word1" #{"id1" "id2"}}]
    (is (= " word1 (2)" (stringify-terms index ["word1"])))))
 
(deftest getting-page-or-default
  (is (= 2 (page-or-default {:page 2})))
  (is (= 1 (page-or-default {}))))

(deftest pagination
  (let [naturals (reductions + (repeat 1))
        intersection-fn (fn [_] (take (dec search-per-page) naturals))
        search-page (partial search-ids intersection-fn [])]
    (is (= (dec search-per-page) (last (:results (search-page 1))))
        "last result of the first page is last element of [1...search-per-page - 1")
    (is (= [] (:results (search-page 2)))
        "second page is empty, because next page pegins at search-per-page")))

;; Insertion mutates the global state: sort by date index, and term index. 
;;
;; Following tests mutate the global state. Tests are written so that as long as 
;; atoms or refs are not reseted, and same id:s are not reused, multiple threads 
;; can execute these tests. 
(deftest inserting-exercise-to-ref-index
  (let [unique-exercise-id "(inserting-exercise-to-ref-index)"
        my-exercise {:_id unique-exercise-id :body "four unique search terms" 
                     :lastModifiedDate date-time}]
    (is (< 0 (insert-exercise-inmem-index my-exercise))
        "the result of insertion is number of search terms in the index")
    (is (= #{unique-exercise-id} (@inverted-index "unique"))
        "as a side effect the inverted-index ref is updated")
    (is (= date-time-long (@timestamps unique-exercise-id))
        "as a side of the insertion effect, timestamps atom is updated to correspond exercise.")))

(deftest intersection-and-sorting
  (let [uid1 "intersect-and-sort1" 
        uid2 "intersect-and-sort2"
        ex1 {:_id uid1 :body "word1 word2 word3" :lastModifiedDate (time/date-time 2000 1 1)}
        ex2 {:_id uid2 :body "word2 word3 word4" :lastModifiedDate (time/date-time 2001 1 1)}]
    (is (< 0 (insert-exercise-inmem-index ex1))
        "modify refs.")
    (is (< 0 (insert-exercise-inmem-index ex2))
        "modify refs.")
    (is (= [uid2 uid1] (vec (intersect-and-sort ["word2" "word3"])))
        "word2 and word3 matched to both documents")))
