export type Photo = {
  src: string;
  alt: string;
  /** CSS object-position kad fokus fotke nije u sredini */
  position?: string;
  /** WebP širine s Drivea (npm run sync); bez njih se koristi samo src */
  srcSet?: string;
  /** koliko je fotka široka na stranici, da preglednik odabere širinu iz srcSet */
  sizes?: string;
};

export type NavItem = {
  /** id sekcije na početnoj stranici */
  id: string;
  label: string;
};

/** Ciljana skupina koju posjetitelj odabere; ista vrijednost ide u ?za= parametar. */
export type Audience = "djeca" | "sportasi" | "rehab";

export type AudienceInfo = {
  id: Audience;
  /** naziv skupine: kartice, tabovi, filteri bloga */
  short: string;
  /** lokativ za podnaslove: "Video o {about}" */
  about: string;
  /** veliki naslov u Uslugama, dva retka */
  title: [string, string];
  lead: string;
  /** velika fotka u sekciji Usluge */
  photo: Photo;
  /** kartica u sekciji "Za koga je trening?" */
  card: Photo;
  /** poster videa dok skupina nema svoj video */
  poster: Photo;
  /** tekst kartice i specifikacija u Uslugama */
  pick: {
    text: string;
    focus: string;
    for: string;
  };
  /** kratki video; null dok ga Gabrijel ne snimi */
  video: { src: string; poster: string } | null;
  method: { title: string; text: string }[];
  newsletter: string;
};

export type Post = {
  slug: string;
  audience: Audience;
  title: string;
  excerpt: string;
  /** ISO datum objave */
  date: string;
  minutes: number;
  /** PDF se otvara u novom prozoru; null dok nije izvezen */
  pdf: string | null;
};

export type Program = {
  tag: string;
  title: string;
  text: string;
  /** null = placeholder dok klijent ne dostavi sliku */
  photo: Photo | null;
  placeholder?: string;
};

/** short: kraća oznaka za mobitel, gdje su sve četiri brojke u jednom retku */
export type Stat =
  | { kind: "text"; value: string; label: string; short?: string }
  | { kind: "count"; value: number; label: string; short?: string };

export type AboutPoint = {
  title: string;
  text: string;
};

export type Review = {
  quote: string;
  author: string;
  source: string;
  /** Google recenzije: pogađa scripts/fetch-google-reviews.mjs, vidi reviewAudienceOverrides */
  audience?: Audience;
};

/** Ono što scripts/fetch-google-reviews.mjs zapisuje u google-reviews.json. */
export type GoogleReviews = {
  rating: number | null;
  count: number | null;
  url: string | null;
  reviews: Review[];
};

export type GalleryItem = Photo & {
  shape: "portrait" | "landscape";
};

export type ContactLink = {
  /** "direct" = telefon/email/adresa, "social" = profili na mrežama */
  group: "direct" | "social";
  label: string;
  value: string;
  href: string;
  external?: boolean;
};
