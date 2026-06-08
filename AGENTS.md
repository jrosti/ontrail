# AGENTS.md — ontrail

Ontrail (ontrail.net) is a training/exercise diary and social network ("harjoituspäiväkirja")
where users log workouts across many sports, comment, "care" (like), join groups, and view
summaries/stats. This file describes the main design so an agent can navigate it quickly.

> Branch note: this describes the **`material-trail`** branch — the frontend uses Google
> Materialize CSS. Other branches (`modern-trail`, `mobile-ui`, `master`, …) carry different
> frontend experiments against essentially the same backend.

## Shape of the system

```
Browser SPA (resources/public)  ──HTTP/JSON──>  Clojure backend (src/ontrail)  ──>  MongoDB (localhost)
   RxJS + jQuery + Materialize        /rest/v1/* , /rest/v2/*           Ring + Compojure + Aleph
                                                                        + WebSocket (real-time)
```

There is no build step that couples the two: the backend serves the static files in
`resources/public` and exposes a JSON REST API; the SPA is hand-written JS that calls it.
(A `reagent`/ClojureScript file exists under `src-cljs/` but it is an unused tutorial stub.)

## Backend (`src/ontrail`)

Clojure 1.6, Leiningen (`project.clj`). Entry point and HTTP wiring: **`core.clj`**.

- **`core.clj`** — `-main` starts an Aleph HTTP+WebSocket server on **port 8080**, rebuilds the
  search index in a `future`, restores the new-comment cache, and schedules periodic work.
  `app-routes` composes, in order: `websocket/async`, `v2routes/v2routes`, `keen/keen-routes`,
  `pages/templates`, and the big inline **`v1routes`** `defroutes`. This is the canonical list
  of the REST API — read it first.
- **`webutil.clj`** — the two macros every route uses:
  - `json-response` — wraps a body as `application/json`, catches exceptions → 500.
  - `is-authenticated?` — guards a route by validating the `authToken` cookie → 401 if missing.
- **`auth.clj` / `crypto.clj`** — scrypt password hashing; `auth-token` / `valid-auth-token?`
  issue and check the token stored in the `authToken` cookie. `authUser` cookie holds the name.
- **`mongodb.clj`** — DB `ontrail` on localhost; collections: `onuser`, `exercise`, `onsport`,
  `groups`, `nccache`. `*db*` is the dynamic var the rest of the code uses via `monger`.
- **`exercise.clj`** — core read model. `as-ex-result` turns a raw Mongo exercise doc into the
  API shape (human distance/time, avatar, comments, tags, sport verb, heart-rate fields,
  visibility rules for anonymous/hidden users). `mutate.clj` is the write side
  (create/update/delete exercise, comment, care, delete-own-comment).
- Supporting domains: `summary` / `sportsummary` / `weekly` / `stats` (aggregations),
  `group`, `user` / `profile`, `search` (in-memory full-text index, rebuilt at boot),
  `newcomment` + `unread` (unread/new-comment tracking with a periodically-persisted cache),
  `nlp` / `parser` / `formats` (parse & humanize durations/distances, Finnish text),
  `races` (yearly "tops"), `keen` (Keen.io analytics routes), `csv` (export),
  `heiaimport` / `treenitimport` / `imgimport` / `import` (data import), `websocket` (live feed).

### REST API conventions

- **Versions**: `/rest/v1/*` is the main API (defined inline in `core.clj`).
  `/rest/v2/*` (`v2routes.clj`) is only the cookie-setting `login`/`logout` (303 redirects, used
  by HTML form posts). Programmatic login is `POST /rest/v1/login` → `{token, username}`.
- **Auth**: reads come mostly open; writes (`POST`/`DELETE`) are wrapped in `is-authenticated?`
  and identify the caller via `user-from-cookie` on the `authToken` cookie.
- **Responses**: always `json-response` (`application/json`); errors return a JSON body with a
  non-200 status (e.g. `{:message "..."} 400`, `{"error" "..."} 401`).
- **Paging**: list endpoints take a `:page` path segment or `page` query param (`webutil/get-page`).

Representative endpoints (see `core.clj` for the full set):

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/rest/v1/ex/:id` | one exercise |
| GET | `/rest/v1/ex-list-all/:page` | latest feed |
| GET | `/rest/v1/ex-list-filter?…&page=` | filtered list (`mongerfilter` builds the query) |
| POST | `/rest/v1/ex/:user` | create exercise |
| POST | `/rest/v1/update/:id` | update exercise |
| DELETE | `/rest/v1/ex/:ex-id` | delete exercise |
| POST | `/rest/v1/ex/:id/comment` · `/care` | comment / like |
| GET | `/rest/v1/summary/:user[/:year[/bymonth\|by/week]]` | summaries |
| GET | `/rest/v1/search?q=&page=` | full-text search |
| GET | `/rest/v1/profile/:user` · POST `/rest/v1/profile` | profile |
| GET/POST | `/rest/v1/groups/:page`, `/groups/:name/join\|part` | groups |
| POST | `/rest/v1/login` · `/register` · `/change-password` | accounts |
| GET | `/rest/v1/validate/{time,distance,username}/…` | live form validation |
| GET | `/rest/v1/export.csv` · `export.json` | data export |

## Frontend (`resources/public`)

A single-page app, no bundler — scripts are loaded directly from `index.html`.

- **`index.html`** — the shell. Loads Materialize CSS/JS + Material Icons, Froala editor,
  select2, pikaday, RxJS, and the app scripts. Hash routing via **jquery.address**.
- **`js/ontrail.js`** (~58 KB) — the actual application logic, namespaced under the global
  `OnTrail`. Built on RxJS observables; it wires DOM events to backend calls and templates.
- **`js/rx.ontrail.backend.js`** — **the single gateway to the REST API.** Defines
  `OnTrail.rest` with one method per endpoint; everything returns an RxJS `Observable`
  (`$.ajaxAsObservable` + a merged error stream). Helpers prefix `"/rest/v1/"`; `s3list` points
  at the separate `blog.ontrail.net` image service. **Add new API calls here**, not ad hoc.
- Other `rx.ontrail.*.js` — `validation` (live field validation), `pager`, `session`,
  `jquery` glue. `chart.js` for graphs, `icanhaz`/Handlebars-style templating.
- `css/material-trail.css` is the branch-specific theme on top of Materialize.

Data flow: DOM/route event → `OnTrail.rest.*()` returns an Observable → mapped to view models →
rendered into Materialize markup. UI text and sport names are largely **Finnish**.

## Running / building

- `lein ring server` (dev, hot reload via `lein-ring`) or `lein run` (`-main`, port 8080).
- Requires a local **MongoDB** with an `ontrail` database (`runmongo.sh`).
- ClojureScript build (`lein cljsbuild`) targets the unused stub — not needed for normal work.
- `lessw.sh` watches LESS → CSS; `rel.sh` is the release script.
- Config: copy `properties_example.clj` (see `conf.clj`).

## Conventions & gotchas

- The whole v1 API lives inline in `core.clj` — that's intentional; keep new routes there and
  push logic into the domain namespace, returning data through `json-response`.
- Auth is cookie-based (`authToken` + `authUser`); the SPA relies on the browser sending them.
- MongoDB connection is a hard-coded localhost default in `mongodb.clj`.
- Search is an in-memory index rebuilt at startup — restarts cost an indexing pass.
- Backend targets old library versions (Clojure 1.6, Aleph 0.3, Monger 2.0); prefer matching
  existing idioms over upgrading.
