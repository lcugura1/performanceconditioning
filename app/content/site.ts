import googleJson from "./google-reviews.json";
import { photos } from "./photos";
import type {
  AboutPoint,
  ContactLink,
  GalleryItem,
  GoogleReviews,
  NavItem,
  Program,
  Review,
  Service,
  Stat,
} from "./types";

export const siteName = "Performance Conditioning";

export const nav: NavItem[] = [
  { id: "usluge", label: "usluge" },
  { id: "programi", label: "programi" },
  { id: "o-meni", label: "o meni" },
  { id: "recenzije", label: "recenzije" },
  { id: "galerija", label: "galerija" },
  { id: "kontakt", label: "kontakt" },
];

export const stats: Stat[] = [
  { kind: "text", value: "Magistar", label: "kineziologije" },
  { kind: "count", value: 100, label: "sportaša i ambicioznih rekreativaca" },
  { kind: "count", value: 5, label: "godina iskustva" },
  { kind: "count", value: 3000, label: "odrađenih treninga" },
];

export const services: Service[] = [
  {
    title: "Djeca sportaši",
    text: "Sigurna i strukturirana izgradnja atletskih temelja — snaga, koordinacija i brzina prilagođeni razvojnoj dobi.",
    photo: { ...photos.coachDrill, alt: "Trener vodi vježbu s mladim sportašima" },
  },
  {
    title: "Sportaši",
    text: "Poboljšanje sportskih performansi — snaga, eksplozivnost i kondicija prema zahtjevima tvog sporta.",
    photo: photos.coachBall,
  },
  {
    title: "Rehabilitacija ozljeda",
    text: "Siguran povratak u sport nakon ozljede — jače i otpornije nego prije.",
    photo: { ...photos.coachTalk, position: "35% center" },
  },
];

export const programs: Program[] = [
  {
    tag: "Teretana · teren",
    title: "Osobni trening",
    text: "Individualni trening za sportaše, djecu sportaše i rehabilitaciju ozljeda, uživo u teretani ili na terenu.",
    photo: photos.walkThree,
  },
  {
    tag: "Online",
    title: "Online suradnja",
    text: "Online trening za sportaše, djecu sportaše i rehabilitaciju ozljeda — gradimo sustav koji mijenja vašu sportsku karijeru, poboljšava performanse i smanjuje ozljede.",
    // TODO: snimka zaslona aplikacije za online treninge
    photo: null,
    placeholder: "Snimka zaslona aplikacije za online treninge",
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

// Ručno odabrane recenzije. Svježe s Googlea (scripts/fetch-google-reviews.mjs)
// idu ispred njih; ista osoba se ne prikazuje dvaput.
const pinnedReviews: Review[] = [
  {
    quote: "Radim kod Gabija vec par mjeseci i top je, od kad sam krenuo s njim poboljsala mi se snaga, eksplozivnost, kondicija…",
    author: "Petar S.",
    source: "Google recenzija",
  },
  {
    quote: "Kondicijska priprema kod trenera Gabrijela je na vrhunskoj razini. Treninzi su stručno vođeni, dobro strukturirani i prilagođeni individualnim potrebama…",
    author: "Josip Z.",
    source: "Google recenzija",
  },
  {
    quote: "Gabrijel je trener koji je vrlo posvecen poslu koji radi, komunikacija je na top nivou te je individualan pristup takoder odlican.",
    author: "Luka M.",
    source: "Google recenzija",
  },
];

const google: GoogleReviews = googleJson;

export const reviews: Review[] = [...google.reviews, ...pinnedReviews].filter(
  (r, i, all) => all.findIndex((o) => o.author === r.author) === i,
);

export const reviewScore = {
  rating: google.rating ?? 5,
  count: google.count,
  url: google.url,
};

export const gallery: GalleryItem[] = [
  { ...photos.walkTwo, shape: "portrait" },
  { ...photos.heroHandshake, alt: "Trener s tri nogometaša", shape: "landscape" },
  { ...photos.coachGesture, alt: "Trener daje upute", shape: "portrait" },
  { ...photos.coachSmile, alt: "Nasmijani trener", shape: "landscape" },
  { ...photos.coachBall, alt: "Trener s loptom", shape: "portrait" },
  { ...photos.coachTalk, alt: "Razgovor sa sportašem", shape: "landscape" },
];

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
