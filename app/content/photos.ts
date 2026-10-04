import type { Photo } from "./types";

// Jedno mjesto za sve fotke. Kad uvedemo sync s Google Drivea,
// ovu datoteku generira skripta (scripts/), a komponente se ne mijenjaju.
// Izvor: design/originals/2026-10-03 (snimanje @capturedwell, broj u komentaru).
export const photos = {
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
    position: "center 45%",
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
