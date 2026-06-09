# plan3 — tech choices & frontend UI replacement

Backend/infra are fixed by `highlevel-plan.md` (Postgres native · TS API · thin SQL-close data
layer · Hanko auth · Caddy · systemd · pg_dump→age→S3 · GitHub Actions). This plan covers the
**frontend stack** and **how each legacy UI element/library is replaced**.

## Principles

- **Minimal surface.** Fewer dependencies = fewer breakages an agent must chase. Prefer web
  standards (native `<dialog>`, `<input type=date>`, `<details>`, `fetch`, `Intl`) over libraries.
- **Longevity.** Pick boring, widely-used, slow-moving tools with long track records; pin the
  runtime; avoid anything commercial or single-vendor.
- **Typed + shared.** One TS types package shared across API boundary (`plan1` contract). The
  shared **formatter module** (`plan1` §3) lives here too, using `Intl` throughout.
- **Durability = types + tests**, not framework choice.

---

## 1. Frontend stack (decided 2026-06-09)

| Layer | Choice | Why | Replaces |
|---|---|---|---|
| Build/dev | **Vite + TypeScript** | De-facto standard, fast, minimal config | (manual script tags) |
| Framework | **React** ✅ | Most mainstream → best agent support + longevity; shared types | jQuery + ICanHaz/Mustache |
| Routing | **TanStack Router** / React Router | Typed routes; replaces hash routing | jquery.address |
| Server state | **TanStack Query** | Caching, dedup, **polling** (the feed), **infinite scroll**, retries | RxJS + rx.ontrail.backend.js |
| Styling | **plain modern CSS** ✅ (nesting, custom props, grid) | Zero deps, never breaks; design tokens in CSS vars | Materialize CSS+JS |
| Rich text | **TipTap** ✅ | ProseMirror-based, HTML in/out, open-source, maintained | Froala (commercial) |
| Charts | **hand-rolled SVG** ✅ | Zero dependency, full control; charts are simple (bars + percentile curve) | Chart.js |
| Dates (pick) | native `<input type="date">` | Built-in, accessible, zero dep | continuousCalendar + Pikaday + xdate |
| Dates / numbers (format) | **`Intl.DateTimeFormat` / `Intl.NumberFormat` / `Intl.DurationFormat`** | Built-in i18n incl. `fi`; no moment | moment.js + moment-locale-fi |
| Multiselect/tags | native `<select multiple>` + a tiny chips input | No heavy widget | select2 + chosen |
| Utilities | native ES (map/filter/reduce/`structuredClone`) | Std lib covers it | lodash |
| HTTP | native `fetch` (wrapped by TanStack Query) | Built-in | jQuery.ajax / rx.jquery |
| Auth token | httpOnly cookie set by backend (Hanko/JWT) | No client token handling | js.cookie + AES cookie scheme |
| Avatars | backend-provided `avatarHash`/URL | Gravatar hash done server-side (privacy, plan1 §4) | jquery.md5 |

**Total runtime deps target: React + router + TanStack Query + TipTap** — four, all open-source
and mainstream. Charts are zero-dep SVG; styling is zero-dep CSS; everything else is
platform/native. TipTap (ProseMirror) is the single heaviest dep; it's isolated to the editor
component so it's swappable.

**Dropped outright:** `fastclick` (obsolete since ~2015), `keen.min.js` (analytics dropped),
the whole `rx.ontrail.*` custom layer (subsumed by TanStack Query + the formatter module).

---

## 2. UI-element replacement guide (Materialize → standards)

| Materialize element | Replacement |
|---|---|
| `navbar-fixed` / `nav` top bar | `<header><nav>` + sticky CSS |
| `side-nav` `slide-out` (mobile drawer) | `<dialog>` or a CSS transform drawer toggled by a button |
| `dropdown-content` (Toiminnot / account menus) | native `<details>`/`<summary>` or a small headless menu |
| `card` / `card-content` / `card-action` | `<article class="card">` + CSS |
| `modal` (delete-ex / delete-comment confirms) | native **`<dialog>`** (`.showModal()`) |
| `chip` (tags) | `<span class="chip">` + CSS; tag input = chips component |
| `tooltipped` (cares, weekly icons) | native `title=""` or a tiny CSS tooltip |
| `fixed-action-btn` (floating "add" button) | `<button>` + `position: fixed` CSS |
| `input-field` floating labels | CSS `:placeholder-shown`/`:focus` floating-label pattern |
| `badge` (unread counts) | `<span class="badge">` + CSS |
| grid `col s12 m6 l4` | CSS Grid / flex with media queries |
| `waves-effect` ripples | drop (cosmetic) or a tiny CSS `:active` effect |
| Material Icons font | inline **SVG icons** — avoids the font CDN dep |
| sport-sprite icons (`span.sport {{sportId}}`) | keep as a CSS sprite / inline SVG set |

---

## 3. How the data/render flow changes

Legacy: jQuery event → RxJS observable → `rx.ontrail.backend.js` ajax → Mustache template → DOM.

New:

- **Component** renders from a **TanStack Query** hook (`useQuery`/`useInfiniteQuery`).
- Feed polling = Query `refetchInterval`; infinite scroll = `useInfiniteQuery` + IntersectionObserver.
- All display values come from the **shared formatter module** (`formatDuration`, `formatPace`, `verbFor`, …) via `Intl` APIs — backend sends raw numbers (`plan1`).
- Mutations (create/comment/care/delete) = Query mutations with optimistic update + invalidate.
- Routing via typed routes; the old `#sport/Juoksu/gte_distance/…` filter URLs become typed search params.
- Live notifications (new comments, feed updates) via **SSE** subscription — TanStack Query invalidates the relevant queries on event.

---

## 4. Decisions (2026-06-09)

1. **Framework → React.**
2. **Styling → plain modern CSS.** Nesting + custom properties + grid; design tokens in CSS vars.
3. **Rich-text → TipTap.** ProseMirror-based, HTML in/out, sanitized on write.
4. **Charts → hand-rolled SVG.** Zero dependency. Simple bar and percentile-curve components.
5. **Locale formatting → `Intl` APIs.** All number, date, duration, and unit formatting via `Intl.NumberFormat`, `Intl.DateTimeFormat`, `Intl.DurationFormat` with locale `'fi'`. No external date/number library.

## 5. Explicit non-goals (avoid scope/dep creep)

- No SSR/Next-style meta-framework — it's an authenticated SPA; a static-served Vite bundle + Caddy is enough.
- No global state library (Redux/MobX) — TanStack Query holds server state; local UI state is component-level.
- No CSS-in-JS runtime, no component kit (MUI/Chakra) — they're large and churn.
- No date library — `Intl` covers Finnish formatting natively.
