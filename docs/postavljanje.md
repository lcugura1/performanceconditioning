# Postavljanje: Google Drive, Cloudflare, selidba s WordPressa

Konkretni koraci za performanceconditioning.hr, prema dokumentu „WordPress → iskodirana stranica” (capturedwell princip), prilagođeni ovom projektu.

Tok: Gabrijel radi samo u Google Driveu (fotke + blog kao Google Docs) → Cloudflare Worker svakih 5 min provjeri promjene → pokrene GitHub Action → Action obradi fotke i blog, spremi ih u R2, builda i deploya statičnu stranicu. WordPress radi netaknut do Faze 7.

## Faza 0: Što je utvrđeno o domeni (provjereno 30. 9. 2026.)

| | Stanje |
|---|---|
| Domena | `performanceconditioning.hr`, besplatna `.hr` domena za obrt, registrirana 16. 6. 2025. Tehnički datum obnove je 18. 5. 2027.; obnavlja se automatski i besplatno svake godine preko registrara (zadnja obnova svibanj 2026.). |
| Nameserveri | `ns1.kuhada.net`, `ns2.kuhada.net` → DNS i hosting su kod **Kuhade** (cPanel, LiteSpeed, IP `178.63.25.160`) |
| Mail | `MX 0 performanceconditioning.hr` → adrese **@performanceconditioning.hr** (ako postoje) žive na Kuhada hostingu i nestaju gašenjem hostinga. Gmail adrese (npr. `performanceconditioning@gmail.com`) nisu pogođene. |
| SPF | **Dva** SPF TXT zapisa (jedan s `include:_spf.mlsend.com` = MailerLite). Dva SPF-a su greška (permerror); u Cloudflareu ih spajamo u jedan. |
| DKIM / DMARC | `default._domainkey` (cPanel), `_dmarc` = `v=DMARC1; p=none;` |
| Google račun | `info@gabrijelperformance.com` je Google Workspace (organizacija `gabrijelperformance.com`, mail na Googleu, DNS na GoDaddyju). Drive i Cloud projekt su na tom računu. Mail na `.hr` domeni se po svemu sudeći ne koristi. |
| Search Console | `google-site-verification=vewrCfxX…` TXT postoji, **ne brisati** |
| WordPress sadržaj | 1 post: `/2025/08/i-jos-jedan-za-carousel/` („Zašto vam je osobni trener potreban?”), stranice `/` i `/blog/`, `/category/uncategorized/` |

Prije Faze 3 pitaj Gabrijela:

1. **Postoji li i koristi li se ikakva adresa `nešto@performanceconditioning.hr`?** (Gmail se ne računa.) Provjera: cPanel → Email Accounts. Ako ih nema, 3d otpada.
2. **Preko kojeg registrara se domena vodi?** Besplatnu `.hr` domenu za obrt dodjeljuje CARNET, ali se vodi preko ovlaštenog registrara (često baš hosting kuća, ovdje vjerojatno Kuhada). Kod njega se mijenjaju nameserveri. Ako je to Kuhada, pitaj ih ostaje li domena kod njih i nakon otkaza hostinga ili je treba prebaciti drugom registraru (prijenos `.hr` domene je besplatan). Popis registrara i provjera: `https://domene.hr`.
3. **Koristi li MailerLite** (newsletter)? Ako da, taj SPF include ostaje.

## Faza 1: Google račun i Drive mape

Sve (Drive, Cloud projekt, Cloudflare) ide na Gabrijelov Google Workspace račun **`info@gabrijelperformance.com`**. `performanceconditioninghr@gmail.com` nije zaseban račun, nego dodatna adresa tog istog računa.

1. (Već postoji.) Račun `info@gabrijelperformance.com`.
2. **myaccount.google.com → Sigurnost** → uključi **Potvrda u 2 koraka**; recovery email `simicicg@gmail.com` potvrdi (trenutno piše „Verification needed”).
3. Otvori **drive.google.com** (prijavljen kao `info@gabrijelperformance.com`) → **+ Novo → Nova mapa** → ime `stranica` → Izradi.
4. Uđi u `stranica` (https://drive.google.com/drive/folders/17s2iSsbYaopxNaiPVB5D9YXB0o60FNn5) i istim gumbom napravi ovu strukturu. Imena točno ovako: mala slova, bez dijakritike, bez razmaka.

   ```
   stranica/
     naslovna/                 ← hero fotka (1; ako ih je više, najnovija)
     djeca/                    ← skupina „Djeca sportaši”
       kartica/                ← kartica u „Za koga je trening?”
       usluga/                 ← velika fotka u sekciji Usluge
       video/                  ← poster videa (kasnije i sam video)
     sportasi/                 ← isto: kartica/, usluga/, video/
     rehabilitacija/           ← isto: kartica/, usluga/, video/
     programi/
       osobni-trening/         ← fotka kartice „Osobni trening”
       online/                 ← fotka kartice „Online suradnja”
     o-meni/                   ← fotka u „O meni”
     galerija/                 ← 8 fotki, redoslijed brojem u imenu (01, 02…)
     kontakt/                  ← fotka uz kontakt
     blog/
       djeca/                  ← objavljeni postovi za djecu sportaše
       sportasi/               ← objavljeni postovi za sportaše
       rehabilitacija/         ← objavljeni postovi o rehabilitaciji
       skice/                  ← ovdje se piše; sync je ne čita
   ```

   Ovo prati sekcije početne stranice (`app/content/photos.ts`, `audiences.ts`). `npm run check:drive` javlja koje mape fale ili su viška.

   **Početne fotke su već složene** u `design/drive-upload/stranica/` (lokalno, nije u gitu): iste fotke kao na stranici sada, a ime fajla je ujedno alt tekst. Upload: obriši stare prazne podmape u `stranica` (`usluge`, `recenzije`, `naslovna-mobitel`, `programi`, `djeca`…, osim `blog`), pa sve mape iz `design/drive-upload/stranica/` povuci mišem u otvorenu mapu `stranica` u Driveu. U `blog/` ručno napravi `djeca`, `sportasi`, `rehabilitacija` i obriši `objavljeno` (prazne mape se ne uploadaju).

5. Ne dijeli mapu ni s kim (dijeljenje dolazi u Fazi 2, korak 8).
6. Otvori mapu `stranica` i u adresnoj traci kopiraj dio iza `/folders/`, **bez** svega od `?` nadalje. Iz `…/folders/17s2iSsbYaopxNaiPVB5D9YXB0o60FNn5?dmr=1&ec=…` ID je `17s2iSsbYaopxNaiPVB5D9YXB0o60FNn5`. To je **`DRIVE_ROOT_FOLDER_ID`** i upisuje se na tri mjesta:
   - lokalno u `.env` u rootu repoa, redak `DRIVE_ROOT_FOLDER_ID=17s2iSsbYaopxNaiPVB5D9YXB0o60FNn5` (već upisano; za `npm run check:drive`; `.env` je u `.gitignore`)
   - GitHub secret (Faza 4, korak 3)
   - Worker secret okidača (Faza 4, korak 6)
7. Na Gabrijelovom mobitelu: **Google Drive app → avatar gore desno → Dodaj drugi račun** → `info@gabrijelperformance.com`. Fotke ubacuje izravno u taj račun. Mapu **ne dijeli** na njegov osobni račun kao Editor (fotke bi tada trošile njegovih 15 GB i nestale kad ih obriše kod sebe).

**Pravila za Gabrijela** (pošalji mu ih napisana):

- **Redoslijed fotki (galerija):** broj na početku imena, `01` prvi. Nenumerirane idu iza, najnovije prve. U mapama s jednom fotkom (naslovna, kartice…) vrijedi najnovija.
- **Opis fotke (alt):** ime fajla je opis („Trener gura sanjke.jpg”); broj na početku se ne računa. Drugačiji opis: desni klik → **Informacije o datoteci → Opis**, on ima prednost.
- **Format:** JPEG ili PNG. S iPhonea: Postavke → Kamera → Formati → „Najkompatibilnije”, ili izvoz u JPEG.
- **Brisanje:** obrisana fotka nestane sa stranice za ~10 min; vraćanjem iz koša vraća se.
- **Blog:** vidi Fazu 5.

## Faza 2: Google Cloud Console (Drive API + service account)

Service account je „robot” koji smije samo čitati mapu `stranica`. Za Drive ne treba ni kartica ni billing. Sve se radi prijavljen kao **`info@gabrijelperformance.com`** (Google Workspace, Gabrijel je super admin), isti račun na kojem je Drive mapa.

### 2a. Uključi Google Cloud za Workspace (jednom)

1. **admin.google.com** → lijevo **Apps → Additional Google services** → u popisu **Google Cloud**.
2. Ako je status OFF: klikni **Service status** → **ON for everyone** → **Save**.
3. Na istoj stranici, ako postoji odjeljak **Cloud Resource Manager**: kvačica **Allow users to create projects** → **Save**.
4. Otvori **console.cloud.google.com/cloud-setup/organization** i prati korake dok ne piše da organizacija `gabrijelperformance.com` postoji. Promjene iz Admin consolea mogu trebati nekoliko minuta.

### 2b. Projekt

1. **console.cloud.google.com** → ako pita: Country **Croatia**, prihvati uvjete. **Free trial / Activate**: **odbij**.
2. Gore lijevo izbornik projekta (piše „Select a project”) → **New project** → Project name: `performanceconditioning` → **Parent resource → Browse** → `gabrijelperformance.com` → **Select** → **Create** → **Select project**.
   Ako je pod Browse i dalje samo sivo „No organization”, pređi mišem preko narančastog trokuta i provjeri 2a.
3. ☰ → **APIs & Services → Library** → `Google Drive API` → **Enable**.
   Ako ovo preskočiš, sync kasnije javlja `PERMISSION_DENIED`, što izgleda kao da mapa nije podijeljena.

### 2c. Dopusti JSON ključ (pravilo organizacije)

Nove organizacije zadano zabranjuju JSON ključeve za service account (`iam.disableServiceAccountKeyCreation`). Isključujemo to samo za ovaj projekt.

1. Gore u izborniku projekta odaberi **organizaciju** `gabrijelperformance.com` (ne projekt).
2. ☰ → **IAM & Admin → IAM** → **Grant access** → New principals: `info@gabrijelperformance.com` → Role: **Organization Policy Administrator** → **Save**.
3. Gore u izborniku vrati se na **projekt** `performanceconditioning`.
4. ☰ → **IAM & Admin → Organization Policies** → u filter upiši `key creation` → otvori **Disable service account key creation** → **Manage policy** → **Override parent's policy** → **Add a rule** → Enforcement **Off** → **Done** → **Set policy**.
5. Ako postoji i **Disable service account key creation (legacy)** / `iam.managed.disableServiceAccountKeyCreation`, ponovi korak 4 i za njega.

### 2d. Service account i ključ

1. ☰ → **IAM & Admin → Service Accounts** → **+ Create service account** → Service account name: `drive-sync` → **Create and continue**.
2. „Grant this service account access to project”: **ne biraj ništa** → **Continue** → **Done**.
3. U popisu klikni service account; adresa (polje **Email**) je `drive-sync@performanceconditioning.iam.gserviceaccount.com`.
4. Tab **Keys → Add key → Create new key → JSON → Create**. Preuzme se `.json` fajl.
   Nikad u repozitorij, nikad mailom. Kad ga upišeš u GitHub i Worker secrets (Faza 4), obriši ga s diska.
   Ako i dalje javlja `iam.disableServiceAccountKeyCreation`: pričekaj par minuta (pravilo se širi sporo) i provjeri 2c.

### 2e. Podijeli mapu sa service accountom

1. Otvori mapu `stranica`: https://drive.google.com/drive/folders/17s2iSsbYaopxNaiPVB5D9YXB0o60FNn5 → gore uz ime mape strelica → **Dijeli → Dijeli**.
2. Zalijepi `drive-sync@performanceconditioning.iam.gserviceaccount.com` → uloga **Čitatelj** (Viewer) → makni kvačicu **„Obavijesti osobe”** → **Dijeli**.
3. Na upozorenje da je adresa izvan organizacije: **Svejedno dijeli**. Ako dijeljenje izvan organizacije nije dopušteno: **admin.google.com → Apps → Google Workspace → Drive and Docs → Sharing settings** → dopusti dijeljenje izvan `gabrijelperformance.com` → Save, pa ponovi.
4. Provjera: `npm run check:drive`. Javlja prijavu, dijeljenje, imena podmapa i broj fotki.

## Faza 3: Cloudflare

### 3a. Račun i preuzimanje DNS-a

1. **dash.cloudflare.com/sign-up** → `info@gabrijelperformance.com` + lozinka → potvrdi mail.
2. Gore desno avatar → **Profile → Authentication → Two-Factor Authentication** → uključi.
3. **Manage Account → Members → Invite** → `leoncugura@gmail.com` → rola **Super Administrator – All Privileges** → Invite. Prihvati poziv iz svog maila; od sada radiš svojim loginom.
4. **Prije ičega izvezi postojeći DNS kod Kuhade:** prijava u cPanel (`https://performanceconditioning.hr/cpanel` ili iz Kuhada korisničkog sučelja) → **Domains → Zone Editor** → `performanceconditioning.hr` → **Manage** → screenshot ili prepiši sve zapise. Pazi posebno na:
   - `A` za `@`, `www`, `mail`, `webmail`, `cpanel`, `autodiscover`, `ftp` (sve na `178.63.25.160`)
   - `MX` (trenutno `0 performanceconditioning.hr`)
   - `TXT`: oba SPF-a, `default._domainkey` (DKIM), `_dmarc`, `google-site-verification`
   - sve što izgleda vezano za MailerLite
5. Cloudflare → **Account Home → + Add a domain** → `performanceconditioning.hr` → „Quick scan for DNS records” → **Continue** → plan **Free** → Continue.
6. Usporedi skenirane zapise s popisom iz koraka 4 i **dopiši što fali** (skener često propusti DKIM i poddomene).
7. **SPF spoji u jedan zapis** (obriši onaj bez `mlsend`):
   `v=spf1 include:_spf.mlsend.com ip4:178.63.25.160 ip4:178.63.25.140 +a +mx +ip4:157.90.76.77 ~all`
8. Proxy status: `MX`, `mail`, `webmail`, `cpanel`, `autodiscover`, `ftp` moraju biti **DNS only** (siva oblak ikona). `@` i `www` mogu ostati narančasti (Proxied).
9. Cloudflare prikaže dva nameservera (npr. `xxx.ns.cloudflare.com`, `yyy.ns.cloudflare.com`). Zapiši ih.
10. Kod registrara (Faza 0, pitanje 2: Kuhada korisničko sučelje → Domene → performanceconditioning.hr → **Nameserveri**, ili portal domene.hr) zamijeni `ns1/ns2.kuhada.net` Cloudflareovima. Za `.hr` promjena može trajati do 24 h; Cloudflare javi mailom „domain is now active”.
11. Provjera: `performanceconditioning.hr` se i dalje otvara (WordPress), mail stiže u oba smjera (pošalji probni), `dig NS performanceconditioning.hr` pokazuje Cloudflare.

Registracija `.hr` domene ostaje gdje je; Cloudflare Registrar ne podržava `.hr`.

### 3b. R2 (fotke i blog slike)

1. Lijevi izbornik → **R2 Object Storage** → **Purchase R2 Plan / Add R2 subscription** → unesi karticu. Kartica je obavezna, ali Free tier (10 GB) se ne naplaćuje.
2. **Create bucket** → ime `pc-media` → Location: Automatic → Storage class: Standard → **Create bucket**.
3. Bucket → **Settings → Custom Domains → + Add** → `img.performanceconditioning.hr` → Continue → Connect domain. Radi tek kad je zona aktivna (3a/10). `r2.dev` javnu adresu **ne uključuj**.
4. Na R2 početnoj (Overview), desno: zapiši **Account ID** → `R2_ACCOUNT_ID`.
5. R2 Overview → **Manage API tokens → Create Account API token** (ili User API token) → ime `github-sync` → Permissions **Object Read & Write** → Specify bucket: samo `pc-media` → TTL **Forever** → Create. Zapiši **Access Key ID** i **Secret Access Key** (secret se prikazuje samo jednom) → `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`.

### 3c. API token za deploy

1. Avatar → **Profile → API Tokens → Create Token** → predložak **Edit Cloudflare Workers → Use template**.
2. Account Resources: Include → tvoj (Gabrijelov) račun. Zone Resources: Include → Specific zone → `performanceconditioning.hr`.
3. **Continue to summary → Create Token** → zapiši → `CLOUDFLARE_API_TOKEN`.

### 3d. Mail nakon gašenja hostinga (odluka prije Faze 7)

Ovisi o odgovoru na Faza 0, pitanje 1:

- **Ne koristi mail na domeni:** ništa; u Fazi 7 samo obriši stare `MX`, `mail`, `webmail`, `autodiscover` zapise.
- **Koristi ga samo za primanje upita (preporuka):** Cloudflare → domena → **Email → Email Routing → Get started** → adresa `info@performanceconditioning.hr` → odredište Gabrijelov Gmail → potvrdi verifikacijski mail → **Add records and enable**. Cloudflare zamijeni MX zapise svojima i doda `include:_spf.mx.cloudflare.net` u SPF. Radi to **tek kad je mail prestao trebati na Kuhadi** (MX može pokazivati samo na jedno mjesto). Slanje s te adrese: Gmail → Postavke → Računi → „Šalji e-poštu kao” preko SMTP-a nekog servisa (npr. Brevo, besplatno 300 mailova/dan).
- **Ima pravi mailbox s porukama koje treba čuvati:** ili ostavi samo mail paket kod Kuhade (pitaj imaju li mail bez hostinga), ili prebaci na Google Workspace (~7 €/mj). Email Routing i Workspace ne mogu dijeliti iste MX zapise.

## Faza 4: GitHub, sync i okidač

Kod je u repou (preneseno iz capturedwella): `scripts/sync-drive.mjs` + `scripts/lib/`, `scripts/fetch-media.mjs`, `wrangler.jsonc` (stranica kao Worker sa static assetima), `.github/workflows/sync.yml`, `worker/sync-trigger/`. Repo: `lcugura1/performanceconditioning` (javan: Actions minute neograničene, logovi javni, pa sync ispisuje samo Drive id-eve).

1. **GitHub token za okidač:** github.com/settings/personal-access-tokens/new → `pc-sync-trigger`, 1 godina, samo repo `lcugura1/performanceconditioning`, **Actions: Read and write**. Podsjetnik u kalendar tjedan dana prije isteka: kad istekne, sync stane (stranica radi, samo se ne ažurira).
2. **Tajne u GitHub** (iz roota repoa, čita lokalni `.env`):

   ```sh
   set -a; . ./.env; set +a
   # JSON ključ ide iz fajla: `. ./.env` mu u shellu pojede navodnike
   gh secret set GOOGLE_SERVICE_ACCOUNT_JSON -R lcugura1/performanceconditioning < ~/.secrets/performanceconditioning/drive-sync-key.json
   for k in DRIVE_ROOT_FOLDER_ID R2_ACCOUNT_ID R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY CLOUDFLARE_API_TOKEN; do
     printf '%s' "${!k}" | gh secret set "$k" -R lcugura1/performanceconditioning
   done
   gh variable set MEDIA_BASE -R lcugura1/performanceconditioning --body "$MEDIA_BASE"
   ```

3. Commit i push na `main` (workflow mora postojati na grani na koju okidač cilja).
4. **Actions → sync → Run workflow** → kvačica `deploy` → Run. Prvi deploy napravi `performanceconditioning.<subdomena>.workers.dev`; tu Gabrijel pregledava stranicu dok WordPress radi na domeni.
5. **Okidač** (iz roota repoa):

   ```sh
   set -a; . ./.env; set +a
   cd worker/sync-trigger
   npx wrangler deploy
   npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_JSON < ~/.secrets/performanceconditioning/drive-sync-key.json
   printf '%s' "$DRIVE_ROOT_FOLDER_ID" | npx wrangler secret put DRIVE_ROOT_FOLDER_ID
   npx wrangler secret put GITHUB_TOKEN    # zalijepi token iz koraka 1
   ```

6. Cloudflare → **Workers & Pages → performanceconditioning-sync-trigger → Logs**: unutar 5 min redak „bez promjena”.
7. Test: ubaci fotku u `galerija/` → run u Actionsu unutar 5 min → fotka na workers.dev za ~10 min.

Lokalno: `npm run sync` (s R2 ključevima u `.env` piše u R2, bez njih u `public/media`), `npm run dev` povlači manifest s `MEDIA_BASE`.

## Faza 5: Blog iz Google Docsa

Gabrijel piše post kao običan Google Doc (ne .docx, kako je bilo u README-u: Doc se piše i uređuje izravno u Driveu, s mobitela također).

**Upute za Gabrijela:**

1. Novi post: u `blog/skice/` → **+ Novo → Google dokumenti**.
2. **Ime dokumenta = naslov posta** (dijakritika je u redu; URL se radi bez nje: „Zašto vam je trener potreban” → `/blog/zasto-vam-je-trener-potreban`).
3. Podnaslovi: izbornik stilova **Naslov 2 / Naslov 3**, ne ručno podebljano.
4. Podebljano, kurziv, linkovi, liste i citati prolaze. Boje, fontovi i veličine se namjerno gube.
5. Slike: **Umetni → Slika**. Prva slika je naslovna slika posta i slika pri dijeljenju.
6. Prvi odlomak je sažetak u popisu postova i opis za Google.
7. **Objava:** premjesti dokument u `blog/djeca/`, `blog/sportasi/` ili `blog/rehabilitacija/` (skupina kojoj je post namijenjen) (desni klik → Organiziraj → Premjesti). **Povlačenje:** vrati u `skice/`. **Izmjena:** uredi dokument izravno u toj mapi; na stranici je za ~10 min.

**Postojeći WordPress post** (samo jedan): otvori `https://performanceconditioning.hr/2025/08/i-jos-jedan-za-carousel/`, kopiraj tekst u novi Doc „Zašto vam je osobni trener potreban?” u `blog/sportasi/`, slike umetni ponovno. Stari URL dobiva 301 (Faza 7), a datum objave (6. 8. 2025.) upisujem ručno u `sync.json`.

Kodni dio (sync `blog/objavljeno/` preko `modifiedTime` i `files.export` u Markdown, rute `/blog` i `/blog/:slug`, prerender iz `blog.json`, meta/OG/JSON-LD, sitemap) je moj posao.

## Faza 6: Google recenzije

Trenutni kod (`scripts/fetch-google-reviews.mjs`) povlači recenzije preko Places API-ja pri buildu i sprema ih u `google-reviews.json`. Dvije stvari o tome:

- Places API traži **billing račun s karticom** u Cloud Consoleu, iako dnevni build (~30 poziva/mj) ostaje u besplatnih 1000 mjesečno.
- **Googleova pravila zabranjuju spremanje sadržaja recenzija** (smije se čuvati samo Place ID). Prerenderiranje u build je tehnički spremanje.

Preporuka iz dokumenta: **A + B**, tj. link „Recenzije na Googleu” + „Ostavi recenziju” i ručno odabrane recenzije koje već imamo u `site.ts`. 0 €, bez kartice, bez kršenja pravila.

Koraci za A:

1. Otvori **developers.google.com/maps/documentation/places/web-service/place-id** → „Place ID Finder” → upiši „Performance Conditioning” → kopiraj Place ID (`ChIJ…`).
2. Link za pisanje recenzije: `https://search.google.com/local/writereview?placeid=<PLACE_ID>`.

Ako ipak želiš živu verziju (C): Cloud Console → isti projekt → **Billing → Link a billing account** (kartica) → **APIs & Services → Library → Places API (New) → Enable** → **Credentials → + Create credentials → API key** → Edit → API restrictions: samo Places API (New) → **Quotas**: Place Details ograniči na npr. 30/dan. Ključ ide u GitHub secret `GOOGLE_PLACES_API_KEY`, nikad u frontend. Uz recenzije se mora prikazati ime autora, link na recenziju i Google atribucija.

## Faza 7: Prelazak s WordPressa

**Prije:**

1. Puni backup WordPressa: cPanel → **Files → Backup Wizard → Full backup** (ili plugin UpdraftPlus). Spremi ga na Drive, čuvaj barem godinu dana.
2. Skini `wp-content/uploads/` (cPanel → File Manager → `public_html/wp-content/uploads` → Compress → Download). Fotke koje trebaju ubaci u Drive mape.
3. Gabrijel odobri stranicu na workers.dev.
4. Mail riješen i testiran (3d).

**Preusmjerenja (301)** u `_redirects` (dio koda):

| Stari URL | Novi |
|---|---|
| `/2025/08/i-jos-jedan-za-carousel/` | `/blog/zasto-vam-je-osobni-trener-potreban` |
| `/blog/` | `/blog` |
| `/category/*`, `/tag/*`, `/author/*` | `/blog` |
| `/feed/`, `/comments/feed/` | `/blog` |
| `/wp-content/uploads/*` | `/` |
| `/wp-admin/*`, `/wp-login.php`, `/xmlrpc.php` | 404 je u redu |

**Prebacivanje:**

1. Cloudflare → **Workers & Pages** → Worker stranice → **Settings → Domains & Routes → + Add → Custom domain** → `performanceconditioning.hr` → Add. Ponovi za `www.performanceconditioning.hr`. Cloudflare sam zamijeni stare `A` zapise prema Kuhadi i izda certifikat.
2. `www` → 301 na golu domenu: domena → **Rules → Redirect Rules → Templates → „Redirect from WWW to root”**.
3. Otvori stare URL-ove iz tablice i provjeri da svaki daje 301 na pravo mjesto.
4. **search.google.com/search-console** → property je verificiran TXT zapisom koji je prešao u Cloudflare, pa ostaje. **Sitemaps** → dodaj `sitemap.xml`.
5. Tjedan dana prati Search Console → **Pages → Not found (404)** i dopiši preusmjerenja koja fale.
6. Nakon 2–4 tjedna bez problema: otkaži Kuhada **hosting**, ali prvo provjeri da domena ostaje kod registrara (ili je prebačena) i da na paketu nema ničeg drugog. Tek tada obriši `mail`, `webmail`, `cpanel`, `ftp`, `autodiscover` zapise i IP-ove Kuhade iz SPF-a.

## Troškovi

| Stavka | Cijena |
|---|---|
| Domena `.hr` | 0 € (kao i sada) |
| Cloudflare Workers (statična stranica + cron okidač) | 0 €. Free plan: zahtjevi za statične fajlove su neograničeni i besplatni; okidač troši ~8.600 poziva mjesečno od 100.000 dnevno. |
| Cloudflare R2 | 0 € do 10 GB spremanja, promet (egress) uvijek besplatan. Kartica obavezna za aktivaciju. Iznad 10 GB ~0,015 $/GB mjesečno. |
| Cloudflare DNS, SSL, Email Routing, Redirect Rules | 0 € |
| GitHub (privatni repo, Actions) | 0 € (2000 min/mj; sync traje par minuta) |
| Google Drive (15 GB), Cloud projekt, Drive API | 0 € |
| Google recenzije A + B | 0 € |
| Google recenzije C (Places API) | 0 € uz dnevnu kvotu; kartica obavezna |
| **Ukupno** | **0 €/mj**, a Kuhada hosting se otkazuje (čista ušteda) |

Jedini realni troškovi koji se mogu pojaviti:

- Drive pun (15 GB dijele Gmail, Drive i Photos namjenskog računa) → Google One 100 GB ~2 €/mj.
- Ako treba pravi mailbox na domeni (ne samo prosljeđivanje) → Google Workspace ~7 €/mj ili mail paket kod Kuhade.

## Checklist

- [ ] Faza 0: Gabrijel odgovorio (mail na domeni, gdje se obnavlja domena, MailerLite)
- [ ] 2FA na `info@gabrijelperformance.com`, recovery mail potvrđen
- [x] Drive mape (root `stranica`, ID `17s2iSsbYaopxNaiPVB5D9YXB0o60FNn5`)
- [x] Cloud projekt, Drive API, service account, JSON ključ, mapa podijeljena kao Čitatelj (`npm run check:drive` prolazi)
- [x] Cloudflare račun, ti kao Super Admin
- [ ] DNS izvezen s Kuhade i prepisan, SPF spojen, nameserveri promijenjeni
- [ ] Provjera: WordPress i mail rade nakon promjene nameservera
- [x] R2 bucket `pc-media` (zasad javno preko r2.dev), R2 token, Workers API token
- [ ] `img.performanceconditioning.hr` na R2, `MEDIA_BASE` prebačen s r2.dev
- [ ] Odluka o mailu (3d)
- [x] Repo, GitHub token + podsjetnik, secrets, prvi deploy na https://performanceconditioning.gabrijel.workers.dev, okidač
- [ ] Blog: sync, rute, prenesen stari post
- [ ] Recenzije: odluka A + B ili C
- [ ] WordPress backup, uploads skinuti, `_redirects`
- [ ] Custom domain na Worker, www → root, Search Console sitemap, tjedan praćenja 404
- [ ] Otkazati Kuhada hosting (domena i mail provjereni)
