# plan3 — tech choices & frontend UI replacement

Backend/infra are fixed by `highlevel-plan.md` (Postgres native · TS API Hono/Fastify · thin
SQL-close data layer · Hanko auth · Caddy · systemd · pg_dump→age→S3 · GitHub Actions). This plan
covers the **frontend stack** and **how each legacy UI element/library is replaced**, optimizing
for the stated goals.

## Principles
- **Minimal surface.** Fewer dependencies = fewer breakages an agent must chase. Prefer web
  standards (native `<dialog>`, `<input type=date>`, `<details>`, `fetch`, `Intl`) over libraries.
- **Longevity.** Pick boring, widely-used, slow-moving tools with long track records; pin the
  runtime; avoid anything commercial or single-vendor (kills the legacy Froala/Keen/Materialize
  churn risk).
- **Typed + shared.** One TS types package shared across API boundary (`plan1` contract). The
  shared **formatter module** (`plan1` §3) lives here too.
- **Durability = types + tests**, not framework choice (per highlevel-plan). So the framework can
  be mainstream-and-boring without guilt.

---

## 1. Recommended frontend stack (decisions in §4)

| Layer | Choice | Why | Replaces |
|---|---|---|---|
| Build/dev | **Vite + TypeScript** | De-facto standard, fast, minimal config, long-lived | (manual script tags) |
| Framework | **React** ✅ | Most mainstream → best agent support + longevity; shared types | jQuery + ICanHaz/Mustache |
| Routing | tiny router (**TanStack Router** / React Router) | Typed routes; replaces hash routing | jquery.address |
| Server state | **TanStack Query** | Caching, dedup, **polling** (the feed), **infinite scroll**, retries — exactly what the custom RxJS backend did, as a maintained lib | RxJS + rx.ontrail.backend.js |
| Styling | **plain modern CSS** ✅ (nesting, custom props, grid) | Zero deps, never breaks; design tokens in CSS vars | Materialize CSS+JS |
| Rich text | **TipTap** ✅ | ProseMirror-based, HTML in/out, open-source, maintained | Froala (commercial) |
| Charts | **hand-rolled SVG** ✅ | Zero dependency, full control, maximal longevity; charts here are simple (bars + a percentile curve) | Chart.js |
| Dates (pick) | native `<input type="date">` | Built-in, accessible, zero dep | continuousCalendar + Pikaday + xdate |
| Dates (format) | **Intl.DateTimeFormat** (+ small helpers) | Built-in i18n incl. `fi`; no moment | moment.js + moment-locale-fi |
| Multiselect/tags | native `<select multiple>` + a tiny chips input | No heavy widget; tags = chips | select2 + chosen |
| Utilities | native ES (map/filter/reduce/`structuredClone`) | Std lib covers it | lodash |
| HTTP | native `fetch` (wrapped by TanStack Query) | Built-in | jQuery.ajax / rx.jquery |
| Auth token | httpOnly cookie set by backend (Hanko/JWT) | No client token handling | js.cookie + AES cookie scheme |
| Avatars | backend-provided `avatarHash`/URL | Gravatar hash done server-side (privacy, `plan1` §4) | jquery.md5 |

**Dropped outright (no replacement):** `fastclick` (obsolete since ~2015), `keen.min.js`
(analytics dropped, plan0), the whole `rx.ontrail.*` custom layer (subsumed by TanStack Query +
the formatter module).

**Decided (2026-06-09):** React · plain modern CSS · TipTap · hand-rolled SVG charts.
Total runtime deps target: **React + router + TanStack Query + TipTap** — four, all open-source
and mainstream (charts are now zero-dep SVG, styling is zero-dep CSS). Everything else is
platform/native. Note TipTap (ProseMirror) is the single heaviest dep and the main thing to keep
an eye on for churn; it's also the most isolated (one editor component), so swappable later.

---

## 2. UI-element replacement guide (Materialize → standards)

Materialize is a dead project (last release 0.x era) and brings its own jQuery-era JS. Replace
component-by-component with semantic HTML + CSS, JS only where the platform lacks it:

| Materialize element (in `index.html`) | Replacement |
|---|---|
| `navbar-fixed` / `nav` top bar | `<header><nav>` + fl: sticky CSS |
| `side-nav` `slide-out` (mobile drawer) | `<dialog>` or a CSS transform drawer toggled by a button; or `<details>` |
| `dropdown-content` (Toiminnot / account menus) | native `<details>`/`<summary>` or a small headless menu; CSS for the panel |
| `card` / `card-content` / `card-action` | `<article class="card">` + CSS (grid/flex, box-shadow) |
| `modal` (delete-ex / delete-comment confirms) | native **`<dialog>`** (`.showModal()`) |
| `chip` (tags) | `<span class="chip">` + CSS; tag input = chips component |
| `tooltipped` (cares, weekly icons) | native `title=""` or a tiny CSS tooltip |
| `fixed-action-btn` (floating "add" button) | `<button>` + `position: fixed` CSS |
| `input-field` floating labels | CSS `:placeholder-shown`/`:focus` floating-label pattern |
| `badge` (unread counts) | `<span class="badge">` + CSS |
| grid `col s12 m6 l4` | CSS Grid / fl with media queries (or container queries) |
| `waves-effect` ripples | drop (cosmetic) or a tiny CSS `:active` effect |
| `collection` (chat list) | n/a — chat dropped (plan0) |
| Material Icons font | inline **SVG icons** (e.g. a small set, or an icon component) — avoids the font CDN dep |
| sport-sprite icons (`span.sport {{sportId}}`) | keep as a CSS sprite / inline SVG set (plan0 keeps icons) |

Net: the only places that *need* JS beyond the framework are the rich-text editor and charts;
menus, modals, drawers, date pickers, and tooltips are all platform features now.

---

## 3. How the data/render flow changes

Legacy: jQuery event → RxJS observable → `rx.ontrail.backend.js` ajax → Mustache template → DOM,
with the in-house pager and 120s memo. New:

- **Component** renders from a **TanStack Query** hook (`useQuery`/`useInfiniteQuery`).
- Feed polling = Query `refetchInterval`; infinite scroll = `useInfiniteQuery` + IntersectionObserver.
- All display values come from the **shared formatter module** (`formatDuration`, `formatPace`,
  `verbFor`, …) applied in the component — backend sends raw numbers (`plan1`).
- Mutations (create/comment/care/delete) = Query mutations with optimistic update + invalidate.
- Routing via typed routes; the old `#sport/Juoksu/gte_distance/…` filter URLs become typed
  search params hitting `/ex-list-filter` (the `mongerfilter` WHERE-builder in SQL).

---

## 4. Decisions (2026-06-09)

1. **Framework → React.** Most mainstream → best agent support + longevity; shared TS types with
   the backend.
2. **Styling → plain modern CSS.** Nesting + custom properties + grid; design tokens in CSS vars.
   Zero-dep and durable; we write component styles by hand (replaces all of Materialize).
3. **Rich-text → TipTap.** ProseMirror-based, HTML in/out, sanitized on write (plan1/plan2). The
   one heavier dep; isolated to the editor component so it's swappable.
4. **Charts → hand-rolled SVG.** Zero dependency. The charts here are simple — weekly distance/
   time bars and the running pace-percentile (f80/f95) curve — so small reusable SVG components
   (`<BarChart>`, `<LineChart>`) cover it without a library.

## 5. Explicit non-goals (avoid scope/dep creep)
- No SSR/Next-style meta-framework — it's an authenticated SPA; a static-served Vite bundle +
  Caddy is enough.
- No global state library (Redux/MobX) — TanStack Query holds server state; local UI state is
  component-level.
- No CSS-in-JS runtime, no component kit (MUI/Chakra) — they're large and churn.
- No date library unless `Intl` proves insufficient for the Finnish formats.
