(ns s3.log
  (:require [taoensso.timbre :as timbre]
            [clojure.string :as str]))

(def log-config
  "APPENDERS
     An appender is a map with keys:
      :doc             ; (Optional) string.
      :min-level       ; (Optional) keyword, or nil (no minimum level).
      :enabled?        ; (Optional).
      :async?          ; (Optional) dispatch using agent (good for slow appenders).
      :rate-limit      ; (Optional) [ncalls-limit window-ms].
      :fmt-output-opts ; (Optional) extra opts passed to `fmt-output-fn`.
      :fn              ; (fn [appender-args-map]), with keys described below.

     An appender's fn takes a single map with keys:
      :level         ; Keyword.
      :error?        ; Is level an 'error' level?.
      :throwable     ; java.lang.Throwable.
      :args          ; Raw logging macro args (as given to `info`, etc.).
      :message       ; Stringified logging macro args, or nil.
      :output        ; Output of `fmt-output-fn`, used by built-in appenders
                     ; as final, formatted appender output. Appenders may (but
                     ; are not obligated to) use this as their output.
      :ap-config     ; Contents of config's :shared-appender-config key.
      :profile-stats ; From `profile` macro.
      :instant       ; java.util.Date.
      :timestamp     ; String generated from :timestamp-pattern, :timestamp-locale.
      :hostname      ; String.
      :ns            ; String.
      ;; Waiting on http://dev.clojure.org/jira/browse/CLJ-865:
      :file          ; String.
      :line          ; Integer.

   MIDDLEWARE
     Middleware are fns (applied right-to-left) that transform the map
     dispatched to appender fns. If any middleware returns nil, no dispatching
     will occur (i.e. the event will be filtered).

  The `example-config` code contains further settings and details.
  See also `set-config!`, `merge-config!`, `set-level!`."

  {;;; Control log filtering by namespace patterns (e.g. ["my-app.*"]).
   ;;; Useful for turning off logging in noisy libraries, etc.
   :ns-whitelist []
   :ns-blacklist []

   ;; Fns (applied right-to-left) to transform/filter appender fn args.
   ;; Useful for obfuscating credentials, pattern filtering, etc.
   :middleware []

   ;;; Control :timestamp format
   :timestamp-pattern "yyyy-MMM-dd HH:mm:ss ZZ" ; SimpleDateFormat pattern
   :timestamp-locale  nil ; A Locale object, or nil

   ;; Output formatter used by built-in appenders. Custom appenders may (but are
   ;; not required to use) its output (:output). Extra per-appender opts can be
   ;; supplied as an optional second (map) arg.
   :fmt-output-fn
   (fn [{:keys [level throwable message timestamp hostname ns]}
        ;; Any extra appender-specific opts:
        & [{:keys [nofonts?] :as appender-fmt-output-opts}]]
     ;; <timestamp> <hostname> <LEVEL> [<ns>] - <message> <throwable>
     (format "%s %s [%s] - %s%s"
             timestamp (-> level name str/upper-case) ns (or message "")
             (or (timbre/stacktrace throwable "\n" (when nofonts? {})) "")))

   :shared-appender-config {} ; Provided to all appenders via :ap-config key
   :appenders
   {:standard-out
    {:doc "Prints to *out*/*err*. Enabled by default."
     :min-level nil :enabled? true :async? false :rate-limit nil
     :fn (fn [{:keys [error? output]}] ; Use any appender args
           (binding [*out* (if error? *err* *out*)]
             (timbre/str-println output)))}

    :spit
    {:doc "Spits to `(:spit-filename :shared-appender-config)` file."
     :min-level nil :enabled? false :async? false :rate-limit nil
     :fn (fn [{:keys [ap-config output]}] ; Use any appender args
           (when-let [filename (:spit-filename ap-config)]
             (try (spit filename output :append true)
                  (catch java.io.IOException _))))}}})

(defmacro use-logging []
  (require '[taoensso.timbre :as timbre])
  (timbre/refer-timbre))

