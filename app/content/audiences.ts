import { photos } from "./photos";
import type { Audience, AudienceInfo } from "./types";

// Sadržaj sekcija "Za koga je trening?" i "Usluge" po ciljanoj skupini. Redoslijed u nizu je zadani
// redoslijed: vrijedi dok posjetitelj ne odabere skupinu.
// TODO: tekstove načina rada i newslettera potvrditi s Gabrijelom.
export const audiences: AudienceInfo[] = [
  {
    id: "djeca",
    short: "Djeca sportaši",
    about: "djeci sportašima",
    title: ["Djeca", "sportaši."],
    lead: "Sigurna i strukturirana izgradnja atletskih temelja — snaga, koordinacija i brzina prilagođeni razvojnoj dobi.",
    photo: photos.svcDjeca,
    card: photos.cardDjeca,
    poster: photos.videoDjeca,
    pick: {
      text: "Temelji kretanja, snaga i koordinacija koji rastu zajedno s djetetom.",
      focus: "Temelji i koordinacija",
      for: "Djecu i roditelje",
    },
    video: null,
    method: [
      {
        title: "Procjena",
        text: "Testiramo koordinaciju, brzinu i držanje te s djetetom i roditeljima razgovaramo o sportu, rasporedu i ciljevima.",
      },
      {
        title: "Temelji kretanja",
        text: "Prije opterećenja učimo pravilan čučanj, skok, doskok, sprint i promjenu smjera — obrasce koji štite od ozljeda.",
      },
      {
        title: "Postupna progresija",
        text: "Opterećenje raste s razvojnom dobi. Trening je igra sa strukturom, ne trening odraslih u malom.",
      },
      {
        title: "Praćenje napretka",
        text: "Testove ponavljamo svakih 6–8 tjedana, a roditelji dobiju kratak pregled napretka i preporuke.",
      },
    ],
    newsletter: "Savjeti za roditelje mladih sportaša: trening, oporavak i prehrana, jednom mjesečno.",
  },
  {
    id: "sportasi",
    short: "Sportaši",
    about: "sportašima",
    title: ["Sportaši na", "višoj razini."],
    lead: "Poboljšanje sportskih performansi — snaga, eksplozivnost i kondicija prema zahtjevima tvog sporta.",
    photo: photos.svcSportasi,
    card: photos.cardSportasi,
    poster: photos.videoSportasi,
    pick: {
      text: "Snaga, eksplozivnost i kondicija prema zahtjevima tvog sporta i pozicije.",
      focus: "Snaga i eksplozivnost",
      for: "Amatere i profesionalce",
    },
    video: null,
    method: [
      {
        title: "Analiza sporta",
        text: "Krećemo od zahtjeva tvog sporta i pozicije: koje kvalitete presuđuju i gdje trenutno gubiš.",
      },
      {
        title: "Testiranje",
        text: "Mjerimo snagu, eksplozivnost, brzinu i kondiciju, da plan počne od brojeva, a ne od pretpostavki.",
      },
      {
        title: "Periodizacija",
        text: "Plan prati sezonu — pripremni period, natjecanja i oporavak — i usklađen je s treninzima u klubu.",
      },
      {
        title: "Retest i prilagodba",
        text: "Napredak redovito mjerimo i mijenjamo plan kad to traže tijelo, rezultati ili raspored.",
      },
    ],
    newsletter: "Trening snage, kondicija i oporavak za sportaše koji žele više, jednom mjesečno.",
  },
  {
    id: "rehab",
    short: "Rehabilitacija",
    about: "rehabilitaciji",
    title: ["Rehabilitacija", "ozljeda."],
    lead: "Siguran povratak u sport nakon ozljede ili operacije, jači nego prije.",
    photo: photos.svcRehab,
    card: photos.cardRehab,
    poster: photos.videoRehab,
    pick: {
      text: "Siguran povratak u sport nakon ozljede ili operacije, jači nego prije.",
      focus: "Siguran povratak",
      for: "Nakon ozljede ili operacije",
    },
    video: null,
    method: [
      {
        title: "Procjena ozljede",
        text: "Polazimo od nalaza liječnika ili fizioterapeuta i mjerimo opseg pokreta, snagu i bol.",
      },
      {
        title: "Vraćanje funkcije",
        text: "Kontroliranim vježbama vraćamo pokretljivost, stabilnost i snagu oko ozlijeđenog područja.",
      },
      {
        title: "Povratak opterećenju",
        text: "Trčanje, skokove i promjene smjera uvodimo postupno, uz jasan kriterij za svaki sljedeći korak.",
      },
      {
        title: "Povratak u sport",
        text: "Prije punog treninga testiramo snagu i simetriju, a zatim nastavljamo raditi da se ozljeda ne ponovi.",
      },
    ],
    newsletter: "Oporavak, prevencija ozljeda i povratak treningu, jednom mjesečno.",
  },
];

/** Skupina koju Usluge prikazuju dok posjetitelj ništa ne odabere. */
export const defaultAudience: Audience = "sportasi";
