import type { Photo } from "./types";
import manifest from "./media.json";

// Jedno mjesto za sve fotke. Fotke dolaze s Google Drivea (npm run sync → media.json,
// docs/postavljanje.md); fotke ispod su rezerva iz public/images dok slot na Driveu
// nema fotku. position i sizes ovise o mjestu na stranici, pa ostaju ovdje.
// Izvor rezerve: design/originals/2026-10-03 (snimanje @capturedwell, broj u komentaru).

type MediaEntry = { id: string; kind: string; width: number; height: number; widths: number[]; alt: string };
type Manifest = { base: string; pages: Record<string, MediaEntry | undefined>; gallery: MediaEntry[] };
const media = manifest as Manifest;

/** Ugrađena širina na stranici, po vrsti mjesta. */
const SIZES = {
  full: "100vw",
  half: "(min-width: 900px) 50vw, 100vw",
  third: "(min-width: 900px) 33vw, 100vw",
  strip: "(min-width: 900px) 30vw, 70vw",
};

/** Unos iz manifesta → Photo: jpg kao src, WebP širine u srcSet. */
function fromMedia(entry: MediaEntry, sizes: string): Photo {
  const url = (w: number, ext: string) => `${media.base}/${entry.kind}/${entry.id}/${w}.${ext}`;
  const jpg = entry.widths.filter((w) => w <= 1600).at(-1) ?? entry.widths[0]!;
  return {
    src: url(jpg, "jpg"),
    srcSet: entry.widths.map((w) => `${url(w, "webp")} ${w}w`).join(", "),
    sizes,
    alt: entry.alt,
  };
}

const fallback = {
  heroGym: {
    src: "/images/hero-gym.jpg",
    alt: "Trener Gabrijel u teretani, prekriženih ruku",
    position: "62% 30%",
  }, // 10
  programGym: {
    src: "/images/program-gym.jpg",
    alt: "Trener izvodi vježbu s medicinkom u teretani",
    position: "center 40%",
  }, // 21
  programOnline: {
    src: "/images/program-online.jpg",
    alt: "Trener radi online plan treninga za laptopom",
    position: "20% center",
  }, // 40
  cardDjeca: {
    src: "/images/card-djeca.jpg",
    alt: "Trener s nogometnom loptom na vanjskom terenu",
    position: "60% center",
  }, // 49
  cardSportasi: {
    src: "/images/card-sportasi.jpg",
    alt: "Trener baca medicinku iznad glave u teretani",
    position: "center 25%",
  }, // 19
  cardRehab: {
    src: "/images/card-rehab.jpg",
    alt: "Trener isteže stražnju ložu na klupi uz teren",
    position: "center 46%",
  }, // 66
  svcDjeca: {
    src: "/images/svc-djeca.jpg",
    alt: "Vježba koordinacije između čunjeva na terenu",
    position: "center 30%",
  }, // 50
  svcSportasi: {
    src: "/images/svc-sportasi.jpg",
    alt: "Trener gura sanjke u teretani",
    position: "center 30%",
  }, // 25
  svcRehab: {
    src: "/images/svc-rehab.jpg",
    alt: "Nasmijani trener na sobnom biciklu u teretani",
    position: "center 30%",
  }, // 31
  videoDjeca: {
    src: "/images/video-djeca.jpg",
    alt: "Trener u startnom položaju na terenu",
  }, // 70
  videoSportasi: {
    src: "/images/video-sportasi.jpg",
    alt: "Trener u sprintu na terenu",
  }, // 61
  videoRehab: {
    src: "/images/video-rehab.jpg",
    alt: "Trener isteže nogu na klupi uz teren",
  }, // 67
  about: {
    src: "/images/about.jpg",
    alt: "Trener Gabrijel na vanjskom terenu",
    position: "center 20%",
  }, // 47
  contact: {
    src: "/images/contact.jpg",
    alt: "Trener u sprintu na terenu, u protusvjetlu",
  }, // 64
  gallery1: { src: "/images/gallery-01.jpg", alt: "Trener u teretani" }, // 1
  gallery2: { src: "/images/gallery-02.jpg", alt: "Trener s medicinkom u teretani" }, // 18
  gallery3: { src: "/images/gallery-03.jpg", alt: "Trener gura sanjke" }, // 27
  gallery4: { src: "/images/gallery-04.jpg", alt: "Sjena trenera na zidu od cigle" }, // 36
  gallery5: { src: "/images/gallery-05.jpg", alt: "Trener s loptom na terenu" }, // 45
  gallery6: { src: "/images/gallery-06.jpg", alt: "Trener u sprintu na terenu" }, // 60
  gallery7: { src: "/images/gallery-07.jpg", alt: "Trener na vanjskom terenu" }, // 77
  gallery8: { src: "/images/gallery-08.jpg", alt: "Trener radi plan treninga za računalom" }, // 44
} satisfies Record<string, Photo>;

type Slot = Exclude<keyof typeof fallback, `gallery${number}`>;

const slotSizes: Record<Slot, string> = {
  heroGym: SIZES.full,
  programGym: SIZES.half,
  programOnline: SIZES.half,
  cardDjeca: SIZES.third,
  cardSportasi: SIZES.third,
  cardRehab: SIZES.third,
  svcDjeca: SIZES.half,
  svcSportasi: SIZES.half,
  svcRehab: SIZES.half,
  videoDjeca: SIZES.half,
  videoSportasi: SIZES.half,
  videoRehab: SIZES.half,
  about: SIZES.half,
  contact: SIZES.full,
};

/** Fotka s Drivea ako slot ima fotku, inače rezerva; position ostaje od rezerve. */
export const photos = Object.fromEntries(
  (Object.keys(slotSizes) as Slot[]).map((slot) => {
    const entry = media.pages[slot];
    const base: Photo = fallback[slot];
    return [slot, entry ? { ...fromMedia(entry, slotSizes[slot]), position: base.position } : base];
  }),
) as Record<Slot, Photo>;

/** Galerija s Drivea, redom kako ju je sync složio; bez nje rezervnih 8. */
export const galleryPhotos: (Photo & { landscape: boolean })[] = media.gallery.length
  ? media.gallery.map((e) => ({ ...fromMedia(e, SIZES.strip), landscape: e.width >= e.height }))
  : [
      fallback.gallery1,
      fallback.gallery2,
      fallback.gallery3,
      fallback.gallery4,
      fallback.gallery5,
      fallback.gallery6,
      fallback.gallery7,
      fallback.gallery8,
    ].map((p, i) => ({ ...p, landscape: i % 2 === 1 }));
