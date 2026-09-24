import { useState, type RefObject } from "react";
import { useScrollFrame } from "~/hooks/useScrollFrame";

export type HeaderScrollState = {
  /** skrolano ispod hera → liquid glass */
  glass: boolean;
  /** ispod headera je tamna sekcija ([data-theme="dark"]) */
  onDark: boolean;
  /** id aktivne sekcije za navigaciju (null iznad hera) */
  active: string | null;
};

// Pojas za scroll spy: od ispod headera do 60 % visine ekrana.
const SPY_BAND_TOP = 96;
const SPY_BAND_BOTTOM = 0.6;
// Staklo se pali čim se stranica pomakne (mala tolerancija za bounce na iOS-u).
const GLASS_AFTER_PX = 4;

export function useHeaderScroll(sectionIds: string[], rowRef: RefObject<HTMLElement | null>) {
  const [state, setState] = useState<HeaderScrollState>({ glass: false, onDark: false, active: null });

  useScrollFrame(() => {
    const vh = window.innerHeight;
    const glass = window.scrollY > GLASS_AFTER_PX;

    // Je li ispod sredine headera tamna sekcija?
    const probe = (rowRef.current?.offsetHeight ?? 96) / 2;
    let onDark = false;
    for (const el of document.querySelectorAll('[data-theme="dark"]')) {
      const r = el.getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) {
        onDark = true;
        break;
      }
    }

    // Scroll spy: sekcija s najviše vidljivih piksela u pojasu.
    // Namjerno ne intersectionRatio — pinned sekcija (usluge) je visoka nekoliko ekrana.
    const bandBottom = vh * SPY_BAND_BOTTOM;
    let active: string | null = null;
    let best = 0;
    for (const id of sectionIds) {
      const r = document.getElementById(id)?.getBoundingClientRect();
      if (!r) continue;
      const visible = Math.min(r.bottom, bandBottom) - Math.max(r.top, SPY_BAND_TOP);
      if (visible > best) {
        best = visible;
        active = id;
      }
    }

    setState((prev) =>
      prev.glass === glass && prev.onDark === onDark && prev.active === active
        ? prev
        : { glass, onDark, active },
    );
  });

  return state;
}
