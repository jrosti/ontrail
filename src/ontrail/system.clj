(ns ontrail.system
  (:use [ontrail mongodb])
  (:require [monger.collection :as mc])
  (:import java.lang.management.ManagementFactory))

(defn get-uptime[]
  (format "%.0f min" (/ (.getUptime (ManagementFactory/getRuntimeMXBean)) 60000.0)))

(defn get-used-heap[]
  (format "%.0fM" (/ (.totalMemory (Runtime/getRuntime)) (* 1024 1024.0))))

(defn get-max-heap[]
  (format "%.0fM" (/ (.maxMemory (Runtime/getRuntime)) (* 1024 1024.0))))

(defn count-exs[]
  (mc/count EXERCISE))

(defn count-users[]
  (mc/count ONUSER))

(defn get-system-stats[]
  {:sysheap (get-used-heap)
   :sysmaxHeap (get-max-heap)
   :sysuptime (get-uptime)
   :sysexs (count-exs)
   :sysusers (count-users)})