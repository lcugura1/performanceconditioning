# Performance Conditioning — predaja dizajna za implementaciju

Single-page web stranica za kondicijskog trenera (Zagreb). Dizajn je napravljen u Claude Design canvasu. Ovaj paket sadrži izvorni kod dizajna kao referencu, sve fotografije i specifikaciju ponašanja.

## Cilj implementacije

- **Stack:** Vite (vanilla, bez frameworka) + Sass (SCSS). Čisti HTML, SCSS i JavaScript, bez UI biblioteka.
- **Rezultat:** statična stranica (`npm run build` → `dist/`) spremna za Netlify, Vercel ili GitHub Pages.
- **Vjernost:** izgled, razmaci, boje, fontovi i animacije moraju odgovarati `design-reference/Main.dc.html`.

## Što je u paketu

```
design-reference/
  Main.dc.html              ← cijela stranica (izvor istine za izgled i ponašanje)
  Stanje-1-vrh.dc.html      ← header iznad hera (proziran)
  Stanje-2-staklo.dc.html   ← header skrolano (liquid glass)
  Stanje-3-mobitel.dc.html  ← mobitel 390px, izbornik otvoren
public/images/              ← sve fotke (web-optimizirane, max 2000px) i logo
HANDOFF.md                  ← ovaj dokument
```

## Kako čitati `.dc.html` datoteke

To je format Design canvasa, ne običan HTML. Pri prebacivanju:

- `<x-dc>`, `<helmet>`, `<script src="./support.js">` i `<script type="text/x-dc">` su dio runtimea canvasa. **Ne kopiraj ih.**
- Sadržaj `<helmet><style>` je CSS stranice → razbij ga u SCSS partiale (dolje).
- `{{nesto}}` su vrijednosti iz metode `renderVals()` u klasi `Component` na dnu datoteke → u vanilla JS-u ih postavljaj izravno na DOM.
- `<sc-for list="{{x}}">` je petlja → napiši markup statično (npr. nav stavke, galerija) ili ga generiraj u JS-u.
- `<sc-if value="{{x}}">` je uvjetni prikaz → koristi klasu ili atribut `hidden`.
- `onClick="{{fn}}"`, `ref="{{setX}}"` → `addEventListener` i `querySelector`.
- Logika (scroll spy, vodoravni skrol, reveal, brojači, popup, mobilni izbornik) je u klasi `Component` → prenesi je u ES module.

### Mapiranje slika (`/_blob/...` → datoteka)

| U dizajnu | Datoteka |
|---|---|
| `/_blob/c0a06770913259a5a4b4ff0e08009ea5` | `images/hero-handshake.jpg` |
| `/_blob/8ce45e28f1223babc0401b5a0bb8ae37` | `images/walk-three.jpg` |
| `/_blob/23d4b0e686103a6dae61424d18793a1f` | `images/walk-two.jpg` |
| `/_blob/f80f2fbb9a569a6db3c97ed475e9d1f7` | `images/thumbs-up.jpg` |
| `/_blob/75f52920965c4feac81a0a4b4b8771b8` | `images/coach-gesture.jpg` |
| `/_blob/874e6d458793f9e447be02550b8c4eb1` | `images/coach-ball.jpg` |
| `/_blob/d22cb1c25412f5cfb5e4e8eb39e68a78` | `images/coach-smile.jpg` |
| `/_blob/7d008f9102e0445f67890be45900cb7e` | `images/coach-drill.jpg` |
| `/_blob/1c83fd00664e11c6b1041b48c5369534` | `images/coach-talk.jpg` |
| `/_blob/773c1ad97dde877b9b1844de460dd938` | `images/logo-mark-dark.png` |
| `/_blob/c3babc733e181eea5275b0db508dac0e` | `images/logo-mark-light.png` |

## Predložena struktura projekta

```
index.html
public/images/…
src/
  main.js                 ← import './styles/main.scss' + init svih modula
  js/
    header.js             ← glass stanje, on-dark, mobilni izbornik, scroll spy, indikator
    horizontal-scroll.js  ← pinned sekcija "Kako vam mogu pomoći?"
    reveal.js             ← IntersectionObserver reveal (.rv, .rv-img)
    counters.js           ← brojači 100+ / 5+ / 3000+
    hero-parallax.js      ← lagani zoom hero fotke
    popup.js              ← newsletter popup (kašnjenje 4 s)
  styles/
    main.scss
    abstracts/_tokens.scss   ← CSS varijable + SCSS varijable/mixini (glass, squircle, breakpoints)
    base/_reset.scss, _typography.scss, _scrollbar.scss
    layout/_header.scss, _footer.scss
    components/_buttons.scss, _glass.scss, _menu-panel.scss, _popup.scss
    sections/_hero.scss, _stats.scss, _services-hscroll.scss, _programs.scss,
             _quote.scss, _about.scss, _reviews.scss, _gallery.scss, _contact.scss
    utilities/_reveal.scss, _a11y.scss
```

## Dizajn tokeni

- **Podloga:** `#f3f2ec` (paper), `#e8e7df` (paper-2, scrollbar traka, sekcija O meni)
- **Tekst:** `#151614` (ink), `#62655d` (muted)
- **Akcent:** `#9eeb47` (lime iz logotipa, štedljivo), `#3f6b12` (tamnozelena za tekst na svijetlom i klizač scrollbara)
- **Tamne sekcije:** Usluge (vodoravni skrol) i Kontakt, pozadina `#151614`
- **Fontovi (Google Fonts):** Archivo (naslovi, 700), Instrument Serif italic (naglasci u naslovima, citati, recenzije), Manrope (tijelo teksta, navigacija)
- **Easing:** `--ease-out-soft: cubic-bezier(.22,.61,.36,1)`, `--ease-bounce: cubic-bezier(.28,1.68,.52,1)`, općeniti `cubic-bezier(.2,.7,.1,1)`
- **Razmaci:** `--spacing-gutter` i `--spacing-header` su fluidni `clamp()` (vidi `:root` u Main.dc.html)

## Ponašanje koje mora ostati točno

1. **Header:** `position: fixed`, proziran iznad hera. Kad je `scrollY > 0.6 × visina ekrana`, dobiva klasu `.glass`. Staklo ide u dva sloja: fallback `blur + saturate` pa `@supports (backdrop-filter: url(#x) blur(1px))` sa SVG filterom `#liquid-glass`. **Vrijednosti filtera ne mijenjati.**
2. **On-dark:** kad je ispod headera sekcija `.hs` ili `.ct`, header dobiva klasu `.on-dark`: tamno staklo, svijetli tekst i svijetla verzija logotipa.
3. **Aktivna stavka navigacije:** kosi lime potez (`skewX(-30deg)`, visina 3px) klizi ispod aktivne stavke s `--ease-bounce` u 520 ms. Iznad hera nema aktivne stavke.
4. **Scroll spy:** aktivna je sekcija s najviše vidljivih piksela u pojasu od 96px do 60 % visine ekrana. Namjerno nije `intersectionRatio`, jer je pinned sekcija visoka nekoliko ekrana.
5. **Klik na nav stavku:** `preventDefault()` → `scrollIntoView({behavior: 'smooth'})` → `history.replaceState`. Sekcije imaju `scroll-margin-top: var(--spacing-header)`.
6. **Mobilni izbornik (< 640px):** burger od 3 crtice koje se pretvore u X, plutajući stakleni panel (`glass glass-rim squircle`). Kad je zatvoren, ostaje u DOM-u sa `visibility` i `inert`. Zatvara se tipkom Esc (fokus se vraća na burger), klikom izvan panela, klikom na stavku i kad ekran postane ≥ 640px. U pravoj implementaciji Esc slušaj na `document`.
7. **Vodoravni skrol (Usluge):** sticky kontejner visine `100svh`. Visina sekcije = visina kontejnera + (širina tracka − širina ekrana). Track se pomiče `translate3d` prema postotku skrola. Visine se preračunavaju na `resize`.
8. **Reveal:** `.rv` fade-up, a `.rv-img` otkrivanje kroz `clip-path` + zoom slike. Klasa `is-ready` na rootu pali početno skriveno stanje samo kad JS radi.
9. **Popup:** nakon 4 s (u produkciji jednom po posjeti, `sessionStorage` u try/catch). Zatvara se klikom na pozadinu ili ✕. Nakon slanja se prikazuje poruka zahvale (forma još nije spojena ni na kakav servis).
10. **Scrollbar:** tanki, klizač `#3f6b12` na traci `#e8e7df`, `overflow-x: clip` (ne `hidden`).
11. **Pristupačnost:** `:focus-visible` obris, `prefers-reduced-motion` gasi animacije, `aria-current` na aktivnoj stavci, `aria-expanded` i `aria-controls` na burgeru.

## Otvoreno / za popuniti

- Instagram i TikTok linkovi (`[INSTAGRAM PROFIL]`, `[TIKTOK PROFIL]`)
- Snimka zaslona aplikacije za karticu "Online suradnja" (trenutno placeholder)
- Spajanje newsletter forme (npr. Mailchimp, Brevo ili MailerLite)
- Pravi Google Reviews widget ili ručno ažurirane recenzije
- Meta tagovi, favicon (PC znak), Open Graph slika
