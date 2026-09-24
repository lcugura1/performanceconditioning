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
    layout/                   Header, Footer, Logo, SiteLayout, LiquidGlassFilter
    ui/                       Icon, Media (fotka / placeholder)
  sections/home/<Sekcija>/    sekcije početne stranice, svaka s .tsx + .scss
  features/newsletter/        popup s prijavom na newsletter
  content/                    SAV tekst i fotke kao tipizirani podaci (site.ts, photos.ts)
  hooks/                      useScrollFrame, useReveal, useInView, useCountUp, useMediaQuery
  lib/                        cx, scroll-frame (zajednički scroll listener), scroll-to
  styles/
    abstracts/                samo Sass: breakpointi, funkcije (automatski u svakom .scss)
    base/                     CSS tokeni, reset, tipografija, scrollbar
    components/               globalne klase: .btn, .link, .media, .glass, .ic
    utilities/                reveal, motion, a11y
public/images/                web-optimizirane fotke i logo
design/
  HANDOFF.md, reference/      izvorni dizajn iz Claude Designa (izvor istine za izgled)
  originals/                  RAW fotke (gitignored)
```

**Pravila:**
- Tekst i fotke mijenjaju se u `app/content/`, ne u komponentama.
- Stil komponente živi uz komponentu (`Hero/Hero.scss`); globalno je samo ono što koristi više komponenti.
- Klase su BEM (`.hero__title`, `.btn--accent`). Tokeni su CSS varijable u `styles/base/_tokens.scss`.
- Efekti vezani uz skrol pretplaćuju se na `useScrollFrame` (jedan listener, jedan poziv po frameu) i pišu stil izravno na DOM, bez React re-rendera.
- Tamne sekcije imaju `data-theme="dark"`, a header se prema tome sam prebacuje u tamno staklo.

## Plan

- **Hosting:** Cloudflare Pages, a postojeća domena se DNS-om preusmjerava s WordPress hostinga.
- **Fotke s Google Drivea:** povlače se pri buildu (skripta u `scripts/`), a ne u pregledniku. Drive nije CDN: hotlinkovi su spori, imaju limite i mogu puknuti. Skripta skida fotke, generira AVIF/WebP u više veličina i ispisuje `app/content/photos.ts`.
- **Blog iz Word dokumenata:** klijent sprema `.docx` u Drive mapu, a build ga pretvara u HTML (npr. `mammoth`) i prerenderira `/blog/:slug`. Novi build se pokreće po rasporedu ili deploy hookom.

## Otvoreno

- Instagram i TikTok linkovi (`app/content/site.ts`)
- Snimka zaslona aplikacije za karticu „Online suradnja”
- Spajanje newsletter forme (Brevo / MailerLite / Mailchimp)
- Recenzije: Google widget ili ručno ažuriranje
- Favicon, Open Graph slika (1200×630)
