// Koja Drive mapa hrani koji dio stranice. Jedino mjesto izvan app/content/photos.ts
// gdje se imena mapa i ključevi fotki ponavljaju: .mjs skripta ne može uvesti TS modul.
// Struktura je opisana u docs/postavljanje.md (Faza 1).

/**
 * Mapa (putanja ispod "stranica") → ključ fotke u photos.ts.
 * Jedna fotka po mapi; ako ih je više, vrijedi najnovija.
 */
export const PAGE_FOLDERS = {
  naslovna: "heroGym",
  "djeca/kartica": "cardDjeca",
  "djeca/usluga": "svcDjeca",
  "djeca/video": "videoDjeca",
  "sportasi/kartica": "cardSportasi",
  "sportasi/usluga": "svcSportasi",
  "sportasi/video": "videoSportasi",
  "rehabilitacija/kartica": "cardRehab",
  "rehabilitacija/usluga": "svcRehab",
  "rehabilitacija/video": "videoRehab",
  "programi/osobni-trening": "programGym",
  "programi/online": "programOnline",
  "o-meni": "about",
  kontakt: "contact",
};

/** Mapa čije sve fotke idu u galeriju, redom po broju na početku imena. */
export const GALLERY_FOLDER = "galerija";

/** Blog po skupinama (Faza 5); sync ih zasad samo čita i broji. */
export const BLOG_FOLDERS = {
  "blog/djeca": "djeca",
  "blog/sportasi": "sportasi",
  "blog/rehabilitacija": "rehab",
};

export const EXPECTED_FOLDERS = [...Object.keys(PAGE_FOLDERS), GALLERY_FOLDER, ...Object.keys(BLOG_FOLDERS)];

/** Alt tekst kad ga nema ni u opisu na Driveu ni u imenu fajla. */
export const DEFAULT_ALT = "Trener Gabrijel, Performance Conditioning";

/**
 * Što sharp otvara bez zaobilaženja. HEIC (zadani format iPhonea) nije tu:
 * sharp ga ne dekodira, pa sync takav fajl preskoči i javi.
 */
export const SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/tiff"]);

/** Original od 100 MB je greška, ne fotka. */
export const MAX_BYTES = 100 * 1024 * 1024;
