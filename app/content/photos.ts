import type { Photo } from "./types";

// Jedno mjesto za sve fotke. Kad uvedemo sync s Google Drivea,
// ovu datoteku generira skripta (scripts/), a komponente se ne mijenjaju.
export const photos = {
  heroHandshake: {
    src: "/images/hero-handshake.jpg",
    alt: "Trener s mladim nogometašima na terenu nakon treninga",
  },
  walkThree: {
    src: "/images/walk-three.jpg",
    alt: "Trener s tri sportaša na terenu",
  },
  walkTwo: {
    src: "/images/walk-two.jpg",
    alt: "Trener i sportaš hodaju terenom",
  },
  thumbsUp: {
    src: "/images/thumbs-up.jpg",
    alt: "Trener sa sportašem, podignut palac",
  },
  coachGesture: {
    src: "/images/coach-gesture.jpg",
    alt: "Trener daje upute na terenu",
  },
  coachBall: {
    src: "/images/coach-ball.jpg",
    alt: "Trener s loptom na terenu",
  },
  coachSmile: {
    src: "/images/coach-smile.jpg",
    alt: "Nasmijani trener na terenu",
  },
  coachDrill: {
    src: "/images/coach-drill.jpg",
    alt: "Trener vodi vježbu s mladim sportašima",
  },
  coachTalk: {
    src: "/images/coach-talk.jpg",
    alt: "Trener u razgovoru sa sportašem",
  },
} satisfies Record<string, Photo>;
