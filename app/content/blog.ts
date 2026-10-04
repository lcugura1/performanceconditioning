import type { Post } from "./types";

// Članci po skupinama. Kad proradi sync s Drivea (docs/postavljanje.md, Faza 5),
// ovaj popis generira skripta: Google Doc → PDF u R2, a ovdje ostaje samo oblik.
// TODO: osim prvog sportaškog (stari WordPress post), naslovi su prijedlozi i PDF-ovi još ne postoje.
export const posts: Post[] = [
  {
    slug: "kada-dijete-moze-poceti-s-treningom-snage",
    audience: "djeca",
    title: "Kada dijete može početi s treningom snage?",
    excerpt: "Trening snage nije opasan za djecu — loše vođen trening jest. Što je primjereno kojoj dobi i na što paziti.",
    date: "2026-09-15",
    minutes: 5,
    pdf: null,
  },
  {
    slug: "prerana-specijalizacija",
    audience: "djeca",
    title: "Prerana specijalizacija: zašto mladi sportaši trebaju više sportova",
    excerpt: "Raznolikost kretanja u ranoj dobi gradi bolje sportaše i smanjuje rizik od preopterećenja.",
    date: "2026-07-02",
    minutes: 4,
    pdf: null,
  },
  {
    slug: "zasto-vam-je-osobni-trener-potreban",
    audience: "sportasi",
    title: "Zašto vam je osobni trener potreban?",
    excerpt: "Struktura, praćenje i plan koji prati tvoj sport — razlika između treniranja i napredovanja.",
    date: "2025-08-06",
    minutes: 4,
    pdf: null,
  },
  {
    slug: "snaga-tijekom-sezone",
    audience: "sportasi",
    title: "Snaga tijekom sezone: kako ne izgubiti formu kroz natjecanja",
    excerpt: "Manje volumena, ista kvaliteta. Kako složiti trening snage uz utakmice i treninge u klubu.",
    date: "2026-08-20",
    minutes: 6,
    pdf: null,
  },
  {
    slug: "povratak-nakon-ozljede-koljena",
    audience: "rehab",
    title: "Povratak nakon ozljede koljena: kriteriji, a ne kalendar",
    excerpt: "Zašto broj tjedana od operacije nije dovoljan i koje testove treba proći prije povratka na teren.",
    date: "2026-09-01",
    minutes: 7,
    pdf: null,
  },
  {
    slug: "trening-tijekom-oporavka",
    audience: "rehab",
    title: "Kako trenirati dok se oporavljaš",
    excerpt: "Ozljeda jednog dijela tijela ne znači pauzu za cijelo tijelo. Što smiješ, a što pričekati.",
    date: "2026-06-10",
    minutes: 5,
    pdf: null,
  },
];

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("hr-HR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
