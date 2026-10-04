import googleJson from "./google-reviews.json";
import { photos } from "./photos";
import type {
  AboutPoint,
  Audience,
  ContactLink,
  GalleryItem,
  GoogleReviews,
  NavItem,
  Program,
  Review,
  Stat,
} from "./types";

export const siteName = "Performance Conditioning";

// Glavna navigacija; kontakt je u headeru gumb "Javi se", a u mobilnom izborniku zadnja stavka.
export const nav: NavItem[] = [
  { id: "usluge", label: "Usluge" },
  { id: "programi", label: "Programi" },
  { id: "o-meni", label: "O meni" },
  { id: "recenzije", label: "Recenzije" },
  { id: "blog", label: "Blog" },
  { id: "galerija", label: "Galerija" },
];

export const contactNav: NavItem = { id: "kontakt", label: "Kontakt" };

export const hero = {
  // dva bloka naslova, drugi uvučen udesno; svaki redak se zasebno podiže
  title: [
    ["Bolja", "izvedba."],
    ["Manje", "ozljeda."],
  ],
  third: "Struktura treninga.",
  lead: "Poboljšaj svoje sportske performanse i riješi se ozljeda. Rad s djecom sportašima, sportašima i rehabilitacija ozljeda.",
  cta: "Želim biti bolji sportaš",
  secondary: "Za koga je trening",
};

export const startHere = {
  title: ["Za koga je", "trening?"],
  lead: "Odaberi što te zanima i stranica će ti prvo pokazati video, članke i način rada za tu skupinu.",
};

export const stats: Stat[] = [
  { kind: "text", value: "Magistar", label: "kineziologije" },
  { kind: "count", value: 100, label: "sportaša i ambicioznih rekreativaca" },
  { kind: "count", value: 5, label: "godina iskustva" },
  { kind: "count", value: 3000, label: "odrađenih treninga" },
];

export const programsTitle = ["Uživo", "ili", "online."];

export const programs: Program[] = [
  {
    tag: "Teretana · teren",
    title: "Osobni trening",
    text: "Individualni trening za sportaše, djecu sportaše i rehabilitaciju ozljeda, uživo u teretani ili na terenu.",
    photo: photos.programGym,
  },
  {
    tag: "Online",
    title: "Online suradnja",
    text: "Online trening za sportaše, djecu sportaše i rehabilitaciju ozljeda — gradimo sustav koji mijenja vašu sportsku karijeru, poboljšava performanse i smanjuje ozljede.",
    photo: photos.programOnline,
  },
];

export const about: AboutPoint[] = [
  {
    title: "Obrazovanje",
    text: "Magistar sam kineziologije s iskustvom i bogatim znanjem iz kineziologije i sportskog treninga.",
  },
  {
    title: "Rad s klijentima",
    text: "Vjerujem da je svaki klijent jedinstven, pa je tako i moj pristup treningu – prilagođen vašim ciljevima i razini iskustva.",
  },
  {
    title: "Rezultati",
    text: "Neki moji klijenti postignu značajne rezultate već nakon par tjedana. Nekima treba više vremena. Svatko ima svoj tempo.",
  },
];

// Citat ispod uvoda u sekciji O meni, dva retka.
// TODO: potvrditi tekst s Gabrijelom
export const aboutQuote = ["Struktura iz znanosti,", "rezultati na terenu."];

// Ručno odabrane recenzije. Svježe s Googlea (scripts/fetch-google-reviews.mjs)
// idu ispred njih; ista osoba se ne prikazuje dvaput.
const pinnedReviews: Review[] = [
  {
    quote: "Radim kod Gabija vec par mjeseci i top je, od kad sam krenuo s njim poboljsala mi se snaga, eksplozivnost, kondicija…",
    author: "Petar S.",
    source: "Google recenzija",
    audience: "sportasi",
  },
  {
    quote: "Kondicijska priprema kod trenera Gabrijela je na vrhunskoj razini. Treninzi su stručno vođeni, dobro strukturirani i prilagođeni individualnim potrebama…",
    author: "Josip Z.",
    source: "Google recenzija",
    audience: "sportasi",
  },
  {
    quote: "Gabrijel je trener koji je vrlo posvecen poslu koji radi, komunikacija je na top nivou te je individualan pristup takoder odlican.",
    author: "Luka M.",
    source: "Google recenzija",
    audience: "sportasi",
  },
];

// Skripta Google recenzije svrstava po ključnim riječima ("sin", "ozljeda"…).
// Kad pogodi krivo, ovdje se ispravlja po autoru, npr. "Ana K.": "rehab".
const reviewAudienceOverrides: Record<string, Audience> = {};

const google = googleJson as GoogleReviews;

export const reviews: Review[] = [...google.reviews, ...pinnedReviews]
  .filter((r, i, all) => all.findIndex((o) => o.author === r.author) === i)
  .map((r) => ({
    ...r,
    audience: reviewAudienceOverrides[r.author] ?? r.audience ?? "sportasi",
  }));

export const reviewScore = {
  rating: google.rating ?? 5,
  count: google.count,
  url: google.url,
};

export const gallery: GalleryItem[] = [
  { ...photos.gallery1, shape: "portrait" },
  { ...photos.gallery2, shape: "landscape" },
  { ...photos.gallery3, shape: "portrait" },
  { ...photos.gallery4, shape: "landscape" },
  { ...photos.gallery5, shape: "portrait" },
  { ...photos.gallery6, shape: "landscape" },
  { ...photos.gallery7, shape: "portrait" },
  { ...photos.gallery8, shape: "landscape" },
];

export const contactHead = {
  title: [
    ["Pošaljite", "mi poruku"],
    ["već", "danas."],
  ],
  intro: "Ostavi kontakt i javit ću ti se da dogovorimo prvi trening.",
  submit: "Dogovori trening",
  // forma za sad otvara WhatsApp s porukom; TODO: pravo slanje (Cloudflare Worker + email)
  sent: "Hvala! Otvorio se WhatsApp s tvojom porukom — samo je pošalji.",
};

export const contact = {
  whatsapp: "https://wa.me/385992994492",
  links: [
    { group: "direct", label: "Telefon", value: "+385 99 299 4492", href: "tel:+385992994492" },
    {
      group: "direct",
      label: "Email",
      value: "performanceconditioninghr@gmail.com",
      href: "mailto:performanceconditioninghr@gmail.com",
    },
    {
      group: "direct",
      label: "Adresa",
      value: "Kuzminečka 10A, Vrbani, Zagreb",
      href: "https://maps.google.com/?q=Kuzminečka+10A,+Vrbani,+Zagreb",
      external: true,
    },
    {
      group: "social",
      label: "Instagram",
      value: "@performanceconditioning.hr",
      href: "https://www.instagram.com/performanceconditioning.hr/",
      external: true,
    },
  ] satisfies ContactLink[],
};
