# OnTrail v2: julkaisu (UpCloud) ja autostart/autostop

Sama skriptipaketti julkaisee minkä tahansa kohteen (esim. `ontrail-test.axorion.fi`, `ontrail.net`). Kaikki kohdekohtainen on `site.env`-tiedostossa (`site.env.example` on pohja); skripteissä ei ole kovakoodattuja osoitteita, polkuja tai portteja. `SITE_ENV=polku` valitsee toisen kohteen.

## Palvelimen rakenne
nginx → `/hanko/` ontrail-paikattu Hanko (loopback), `/api/` Bun-API (loopback), muu staattista (`apps/web/dist`). Postgres: yksi rooli, kaksi kantaa (`$APP`, `${APP}_hanko`). systemd: `$APP-hanko`, `$APP-api`. Salaisuudet (tietokannan salasana, Hankon avain) generoidaan palvelimelle `/etc/$APP/`.

## Ensimmäinen julkaisu
1. `cp deploy/site.env.example deploy/site.env` ja täytä (SITE_HOST, SSH_HOST, sähköposti).
2. Asenna TLS-sertifikaatti palvelimelle (`SSL_CERT`, `SSL_KEY`; esim. Cloudflare Origin CA tai Let's Encrypt).
3. `deploy/deploy.sh` (rakentaa web:n, ontrail-paikatun Hankon linux/amd64:lle, lähettää, ajaa palvelimen valmistelun `server/setup.sh` ja `server/release.sh`).
4. Myöhemmin pelkkä `deploy/deploy.sh`; `SETUP=1` ajaa valmistelun uudelleen (nginx, systemd).

Vaatimukset paikalliselle koneelle: `bun`, `go`, `rsync`, `ssh`. Hankon lähdekoodi: `HANKO_SRC` (paikkaukset `infra/hanko/patches` sovelletaan kopioon).

## Autostop (sammuu itsestään)
API laskee joutilaisuuden (`apps/api/src/idle.ts`): onnistunut oikea `/api/*`-käyttö nollaa laskurin (ei health/idle, ei virheet). `GET /api/idle` vastaa vain palvelimelta itseltään. `AUTOSTOP=1` asentaa ajastimen `$APP-autostop` (kysyy minuutin välein, sammuttaa `IDLE_GRACE_MS` jälkeen). Kytkin pois oletuksena: `echo enabled > /etc/$APP/autostop` vasta kun herätys on kokeiltu. Julkaisu asettaa lukon (`/run/$APP-deploy.lock`), jolloin ei sammuteta kesken. `AUTOSTOP=peers` rekisteröi tämän sovelluksen `/api/idle`-osoitteen toisen sovelluksen ajastimelle (jaettu kone, esim. Punakynän `/etc/punakyna/idle-peers`).

## Autostart (herää kun joku tulee)
Cloudflare-Worker (`deploy/edge`) palvelee staattisen käyttöliittymän aina ja välittää `/api` ja `/hanko` palvelimelle. Kun palvelin nukkuu, API-kutsut saavat `503 {asleep:true}`, web ohjaa `/wake.html`-sivulle, joka käynnistää palvelimen UpCloud-rajapinnasta (`POST /wake`, Turnstile taustalla + rajoitin) ja jatkaa kun palvelin vastaa (alle minuutti).
Vaatimukset: `EDGE_WORKER`, `TURNSTILE_SITE_KEY`, `ORIGIN_HOST` ≠ `SITE_HOST` (proxattu DNS-tietue, Origin CA) site.env:ssä; salaisuudet Workerille: `wrangler secret put UPCLOUD_API_TOKEN|UPCLOUD_SERVER_UUID|TURNSTILE_SECRET_KEY --name $EDGE_WORKER` (aliasiasiakas, jolla oikeus vain tähän palvelimeen). `EDGE=1 deploy/deploy.sh` julkaisee Workerin. Huomaa: UpCloudissa vain Cloud Native -palvelimet laskutetaan vain käyntiajalta.
