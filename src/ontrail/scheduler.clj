(ns ontrail.scheduler
  (:import [java.util.concurrent Executors TimeUnit]))

(defn schedule-work
  ([f rate]
     (let [pool (Executors/newSingleThreadScheduledExecutor)]
       (.scheduleAtFixedRate
        pool f (long 0) (long rate) TimeUnit/SECONDS)
       pool)))