# Live tracking API

Stream an in-progress workout from a phone/watch app (the marathon app) to OnTrail. Anyone with
the session's **share link** can watch it live; when the workout ends the session becomes a normal
exercise in the owner's diary.

Implementation: `apps/api/src/repositories/live.ts`, routes in `apps/api/src/server.ts`,
migration `0007_live_tracking.sql`. Tests: `server.integration.test.ts` ("live tracking
integration"), `live/geo.test.ts`, `live/finish.test.ts`.

## Lifecycle

```
POST /api/live ──► active ──POST …/points (repeat)──► POST …/finish ──► finished  (+ exercise)
                      └────────────DELETE …/{id}────► discarded (track deleted, link dead)
```

* A user has **at most one active session**. Starting a second returns `409` with the existing
  session, so the app can resume after a crash (`GET /api/live/active` does the same).
* Two identifiers: `id` (UUID) is the owner's handle and is never shown publicly;
  `shareToken` (22 URL-safe chars, 128 random bits) is the public handle. Share
  `<web origin>/live/<shareToken>` with spectators.

## Authentication (owner endpoints)

Owner endpoints need `Authorization: Bearer <Hanko session JWT>` — the same token as every other
authenticated endpoint (`apps/api/src/auth/hanko.ts`, verified against the Hanko JWKS). The native
app performs a Hanko login and sends the resulting session JWT. Session JWTs expire, so the app
must refresh/re-login on `401` and **retry the failed request**; point uploads are idempotent so
retrying is always safe.

> To verify against the real Hanko instance when the marathon app is wired up: how the native
> client receives the session JWT (Hanko returns it in the `X-Auth-Token` response header when
> the cookie is not usable) and its configured lifetime.

Public endpoints (`GET /api/live/:token…`) need no authentication.

## Owner endpoints

### `POST /api/live` — start

Body (all optional): `{ "sport": "run", "title": "Sunday long run" }`. `sport` is a sport key from
`GET /api/sports` (default `run`).

* `201` → session object (below)
* `409 {"error":"active_session_exists","session":{…}}` — resume that one instead
* `400 {"error":"invalid_sport"|"invalid_title"}`

```json
{
  "id": "0f8f…", "shareToken": "mQ3x…22chars", "status": "active",
  "sport": "run", "title": "Sunday long run",
  "startedAt": "2026-06-20T09:00:00.000Z", "lastPointAt": null, "endedAt": null,
  "distanceM": 0, "pointCount": 0, "lastSeq": null, "lastHr": null, "exerciseId": null
}
```

### `GET /api/live/active` — resume

`200` session object, or `404` when there is no active session.

### `POST /api/live/:id/points` — upload a batch

```json
{ "points": [
  { "seq": 0, "t": "2026-06-20T09:00:01Z", "lat": 60.1699, "lon": 24.9384, "ele": 12.5, "hr": 148 }
] }
```

| field | rules |
|---|---|
| `seq` | integer ≥ 0, **client-assigned and monotonic per session**. It is the idempotency key. |
| `t` | ISO 8601 time of the GPS fix; not more than 24 h in the future |
| `lat`, `lon` | degrees, WGS84 |
| `ele` | metres, optional |
| `hr` | integer 20–250 bpm, optional |

* 1–1000 points per request, up to 100 000 per session.
* The whole batch is rejected on the first invalid point:
  `400 {"error":"invalid_point_<index>_<field>"}` (also `points_required`, `too_many_points`).
* Re-sending points with a `seq` already stored is a no-op, so on any network error or `401`
  simply resend the same batch. Out-of-order batches are stored; running totals only advance for
  points newer than the current tail, and `finish` recomputes exactly from every point.
* `200 { accepted, duplicates, pointCount, distanceM, lastSeq, lastHr }`
* `409 session_not_active` (finished/discarded), `413 session_full`, `403` (not the owner), `404`.

Server-side live distance is the haversine path length of the GPS fixes in `seq` order.

### `POST /api/live/:id/finish` — end and save as an exercise

Body is optional; every field is an override:

```json
{ "title": "…", "body": "<p>notes</p>", "tags": ["pitkä"], "feelRating": "ok",
  "durationCs": 912345, "distanceM": 21097, "avgHr": 151, "date": "2026-06-20" }
```

Defaults when omitted:

| exercise field | default |
|---|---|
| `title` | the session title |
| `durationCs` | **first-to-last point span** (centiseconds). This includes paused time — send the watch's moving time as `durationCs` if the workout can be paused. |
| `distanceM` | haversine track length rounded to metres (none if fewer than 2 points) |
| `avgHr` | mean of the `hr` samples |
| `date` | calendar day of the first point in `Europe/Helsinki` |
| `gpxPoints` | the track (`lat`,`lon`,`ele`), thinned evenly to ≤ 3000 points, first/last kept |

Units follow `plans/units.md`: durations are **centiseconds**, distances are metres.

* `200 { "session": {…status "finished", "exerciseId"}, "exercise": {…full exercise…} }`
* **Idempotent**: finishing again returns the same exercise, never a duplicate.
* `409 session_not_active` (discarded), `400` validation (`invalid_duration`, `invalid_date`, …),
  `403`, `404`.

### `DELETE /api/live/:id` — discard

Deletes the track and kills the public link. `200 {"ok":true}`; `409` if the session is already
finished (delete the resulting exercise instead).

## Public endpoints (spectators)

### `GET /api/live/:token[?after=<seq>]`

Snapshot, `Cache-Control: no-store`. `after` returns only points with `seq` greater than it
(at most 5000 per call), so a viewer fetches once and then follows the stream.

```json
{
  "status": "active", "sport": "run", "title": "Sunday long run",
  "owner": { "username": "jorgen", "displayName": "Jörgen", "initials": "JÖ", "color": "oklch(…)" },
  "startedAt": "…", "lastPointAt": "…", "endedAt": null, "elapsedCs": 123400,
  "distanceM": 5231, "pointCount": 412, "lastSeq": 411, "lastHr": 151, "avgHr": 147,
  "exerciseId": null,
  "points": [ { "seq": 0, "t": "…", "lat": 60.17, "lon": 24.94, "ele": 12.5, "hr": 148 } ]
}
```

`404` for unknown, malformed or discarded tokens (indistinguishable on purpose). Owner e-mail and
the internal session `id` are never exposed. After finishing, `status` is `finished` and
`exerciseId` links to the saved exercise.

### `GET /api/live/:token/stream` (Server-Sent Events)

No authentication. Events:

| event | data |
|---|---|
| `ping` | `{}` every 30 s |
| `points` | `{ points: [...new points], distanceM, pointCount, lastSeq, lastHr }` |
| `finished` | `{ exerciseId, distanceM }` |
| `discarded` | `{}` |

Recommended viewer flow: `GET /api/live/:token`, open the stream, drop streamed points whose
`seq` is ≤ the highest already shown. After a reconnect, call the snapshot again with
`?after=<lastSeq>` to fill any gap.

## Privacy and limits

* The share link exposes the live location trail, including where the workout started, to anyone
  who has the link. Discarding a session removes the track immediately; finished tracks live on in
  the exercise and follow the normal exercise visibility rules (GPX is visible to logged-in users
  only).
* The SSE hub is in-memory (single API process), like the existing `/api/sse`.
* Not implemented yet: expiring abandoned `active` sessions automatically.
