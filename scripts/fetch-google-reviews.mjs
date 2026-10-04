// Pri buildu povlači ocjenu i recenzije s Google Places API-ja (New) i
// zapisuje ih u app/content/google-reviews.json. Stranica je statična, pa nove
// recenzije stižu sa svakim novim buildom (deploy hook po rasporedu).
//
// Potrebno (.env lokalno, env varijable na Cloudflare Pagesu):
//   GOOGLE_PLACES_API_KEY  – ključ s uključenim "Places API (New)"
//   GOOGLE_PLACE_ID        – Place ID profila (ChIJ…)
//
// Bez ključa ili ako Google vrati grešku, postojeća datoteka ostaje netaknuta
// i build se nastavlja.

import { writeFile } from "node:fs/promises";

const OUT = new URL("../app/content/google-reviews.json", import.meta.url);
// Google vraća najviše 5 recenzija; prikazujemo samo one s tekstom i ovom ocjenom.
const MIN_RATING = 4;
const MAX_CHARS = 190;

const key = process.env.GOOGLE_PLACES_API_KEY;
const placeId = process.env.GOOGLE_PLACE_ID;

if (!key || !placeId) {
  console.log("[google-reviews] nema GOOGLE_PLACES_API_KEY/GOOGLE_PLACE_ID, preskačem");
  process.exit(0);
}

/** "Petar Sušić" → "Petar S." */
function shortName(name) {
  const [first, ...rest] = name.trim().split(/\s+/);
  const last = rest.at(-1);
  return last ? `${first} ${last[0].toUpperCase()}.` : first;
}

// Svrstavanje u skupinu (app/content/types.ts → Audience) po punom tekstu.
// Prvo djeca, pa rehabilitacija; sve ostalo su sportaši. Krive pogotke
// ispravlja reviewAudienceOverrides u app/content/site.ts.
const AUDIENCE_KEYWORDS = [
  [
    "djeca",
    /\b(sin|sina|sinu|sinom|k[cć]i|k[cć]er\w*|dijete|djeteta|djetetu|djeca|djece|djeci|djecom|klinac|klinc\w*|roditelj\w*)\b/i,
  ],
  [
    "rehab",
    /\b(ozlj?ed\w*|ozlijed\w*|rehab\w*|operacij\w*|operira\w*|koljen\w*|kri[zž]n\w*|ligament\w*|menisk\w*|fizio\w*|oporav\w*|istegnu\w*|puknu\w*|bolov\w*)\b/i,
  ],
];

function audienceOf(text) {
  return AUDIENCE_KEYWORDS.find(([, re]) => re.test(text))?.[0] ?? "sportasi";
}

/** Skraćuje na granici riječi, kao ručno unesene recenzije. */
function clip(text) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= MAX_CHARS) return clean;
  const cut = clean.slice(0, MAX_CHARS);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,.;:–-]+$/, "")}…`;
}

try {
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=hr`, {
    headers: {
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const place = await res.json();

  const reviews = (place.reviews ?? [])
    .filter((r) => r.rating >= MIN_RATING)
    .map((r) => ({
      // originalText = tekst kako ga je autor napisao, bez Googleova prijevoda
      text: (r.originalText ?? r.text)?.text,
      author: r.authorAttribution?.displayName,
      time: r.publishTime,
    }))
    .filter((r) => r.text && r.author)
    .sort((a, b) => (b.time ?? "").localeCompare(a.time ?? ""))
    .map((r) => ({
      quote: clip(r.text),
      author: shortName(r.author),
      source: "Google recenzija",
      audience: audienceOf(r.text),
    }));

  const data = {
    rating: place.rating ?? null,
    count: place.userRatingCount ?? null,
    url: place.googleMapsUri ?? null,
    reviews,
  };
  await writeFile(OUT, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`[google-reviews] ${reviews.length} recenzija, ocjena ${data.rating} (${data.count})`);
} catch (err) {
  console.warn(`[google-reviews] dohvat nije uspio, zadržavam postojeće: ${err.message}`);
}
