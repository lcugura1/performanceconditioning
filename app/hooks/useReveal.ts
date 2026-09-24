import { useEffect } from "react";
import { REVEAL_OBSERVER_OPTIONS } from "./useInView";

const SELECTOR = ".rv:not([data-revealed]), .rv-img:not([data-revealed])";

/**
 * Otkriva `.rv` (fade-up) i `.rv-img` (clip-path + zoom) elemente kad uđu u viewport.
 * Stanje se piše u atribut `data-revealed`, a ne u klasu, jer React pri
 * re-renderu prepisuje `className` ali ne dira atribute koje ne poznaje.
 *
 * Pokreni ponovno kad se promijeni sadržaj stranice (npr. `key` = pathname).
 */
export function useReveal(key: unknown) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(SELECTOR);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.setAttribute("data-revealed", ""));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-revealed", "");
        io.unobserve(entry.target);
      }
    }, REVEAL_OBSERVER_OPTIONS);

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);
}
