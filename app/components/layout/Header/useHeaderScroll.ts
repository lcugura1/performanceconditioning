import { useState } from "react";
import { useScrollFrame } from "~/hooks/useScrollFrame";

// Staklo se pali kad se stranica pomakne malo više od bouncea na iOS-u.
const SOLID_AFTER_PX = 40;

/** true kad je stranica skrolana → header dobiva tamno staklo (.is-solid). */
export function useHeaderScroll() {
  const [solid, setSolid] = useState(false);

  useScrollFrame(() => {
    const next = window.scrollY > SOLID_AFTER_PX;
    setSolid((prev) => (prev === next ? prev : next));
  });

  return solid;
}
