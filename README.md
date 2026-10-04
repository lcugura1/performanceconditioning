# Performance Conditioning

Web stranica kondicijskog trenera (Zagreb). React 19 + React Router 8 (framework mode, Vite) + TypeScript + Sass.
Stranica je **potpuno statična**: `npm run build` svaku rutu prerenderira u HTML (`build/client/`), bez runtime servera.

## Pokretanje

```sh
npm install
npm run dev        # razvoj na http://localhost:5173
npm run build      # statični build u build/client
npm run preview    # posluži build lokalno
npm run typecheck
```

## Struktura

```
app/
  root.tsx                    HTML dokument, fontovi, globalni stilovi, error boundary
  routes.ts                   popis ruta
  routes/                     stranice (home.tsx; kasnije blog)
  components/
    layout/                   Header, Footer, Logo, SiteLayout
    ui/                       Icon, Grain (zrno preko fotke), LogoMark
  sections/home/<Sekcija>/    sekcije početne stranice, svaka s .tsx + .scss
  features/audience/          useAudience: odabrana skupina (localStorage, ?za= parametar)
  content/                    SAV tekst i fotke kao tipizirani podaci (site.ts, audiences.ts, blog.ts, photos.ts)
  hooks/                      useScrollFrame, useReveal, useInView, useCountUp
  lib/                        cx, scroll-frame (zajednički scroll listener), scroll-to
  styles/
    abstracts/                samo Sass: breakpointi, funkcije (automatski u svakom .scss)
    base/                     CSS tokeni, reset, tipografija, scrollbar
    components/               globalne klase: .pill, .ulink, .btns, .bw/.grid-ov/.grain, .ufield, .tag, .ic
    utilities/                reveal, motion, a11y
public/images/                web-optimizirane fotke i logo
design/
  Performance Conditioning — web.html   export iz Claude Designa; ploča "Redizajn — crno-bijelo" je izvor istine za izgled
  originals/                  originalne fotke (gitignored); 2026-10-03/ = snimanje @capturedwell, brojevi u photos.ts
```

**Pravila:**
- Tekst i fotke mijenjaju se u `app/content/`, ne u komponentama.
- Stil komponente živi uz komponentu (`Hero/Hero.scss`); globalno je samo ono što koristi više komponenti.
- Klase su BEM (`.hero__in`, `.pill--white`). Tokeni su CSS varijable u `styles/base/_tokens.scss`, breakpointi `nav` (1100), `tablet` (820), `phone` (560).
- Stranica je tamna; fotke su u izvornoj boji, crno-bijeli su (`.bw`) samo hero i kontakt; lime (`--accent`) samo kao rijedak naglasak.
- Efekti vezani uz skrol pretplaćuju se na `useScrollFrame` (jedan listener, jedan poziv po frameu).

## Plan

- **Hosting:** Cloudflare Pages, a postojeća domena se DNS-om preusmjerava s WordPress hostinga.
- **Fotke s Google Drivea:** povlače se pri buildu (skripta u `scripts/`), a ne u pregledniku. Drive nije CDN: hotlinkovi su spori, imaju limite i mogu puknuti. Skripta skida fotke, generira AVIF/WebP u više veličina i ispisuje `app/content/photos.ts`.
- **Google recenzije:** `npm run build` prvo pokreće `scripts/fetch-google-reviews.mjs`, koja preko Places API-ja zapisuje ocjenu i recenzije u `app/content/google-reviews.json`. Google daje najviše 5 najnovijih/najrelevantnijih; ručno odabrane u `site.ts` se prikazuju uz njih. Nove recenzije se pojave s idućim buildom.
- **Sadržaj po skupini:** sekcija „Za koga je trening?” nudi tri skupine (djeca sportaši, sportaši, rehabilitacija). Odabir (localStorage ili `?za=djeca|sportasi|rehab`) određuje koju skupinu Usluge prikazuju i koje recenzije i članci idu prvi. Bez odabira Usluge prikazuju `defaultAudience` iz `audiences.ts`.
- **Blog:** Gabrijel piše Google Doc u Driveu, sync ga izvozi u PDF (Drive `files.export`) i sprema u R2; `app/content/blog.ts` tada generira skripta. PDF se otvara u novom prozoru.
- **Video po skupini:** kratki MP4 (H.264, 720p, `faststart`) i poster s istog R2-a. Učitava se tek na klik.

## Otvoreno

- Kontakt forma za sad otvara WhatsApp s porukom; pravo slanje (Cloudflare Worker + email)
- Spajanje newsletter forme na MailerLite, jedna grupa po skupini
- Videi i PDF-ovi članaka; tekstovi načina rada i naslovi članaka u `audiences.ts` / `blog.ts` su prijedlozi za potvrdu
- Google recenzije: postaviti `GOOGLE_PLACES_API_KEY` i `GOOGLE_PLACE_ID` na Cloudflare Pagesu te dnevni rebuild (deploy hook + cron)
- Favicon, Open Graph slika (1200×630)
