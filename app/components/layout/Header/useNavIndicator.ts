import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

const INSTANT_TRANSITION = "opacity 200ms cubic-bezier(.22,.61,.36,1)";

/**
 * Kosi lime potez ispod aktivne stavke. Pri promjeni stavke klizi (--ease-bounce),
 * a pri prvom prikazu, resizeu i učitavanju fontova postavlja se bez animacije.
 */
export function useNavIndicator(active: string | null) {
  const navRef = useRef<HTMLElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);
  const shown = useRef(false);

  const place = useCallback(
    (instant: boolean) => {
      const nav = navRef.current;
      const ind = indRef.current;
      if (!nav || !ind) return;

      const link = active ? nav.querySelector<HTMLElement>(`a[data-id="${active}"]`) : null;
      if (!link) {
        ind.style.opacity = "0";
        shown.current = false;
        return;
      }

      const apply = () => {
        ind.style.width = `${link.offsetWidth}px`;
        ind.style.transform = `translateX(${link.offsetLeft}px) skewX(-30deg)`;
      };

      if (instant || !shown.current) {
        const prev = ind.style.transition;
        ind.style.transition = INSTANT_TRANSITION;
        apply();
        void ind.offsetWidth; // forsiraj layout prije vraćanja tranzicije
        ind.style.transition = prev;
      } else {
        apply();
      }
      ind.style.opacity = "1";
      shown.current = true;
    },
    [active],
  );

  useLayoutEffect(() => place(false), [place]);

  useEffect(() => {
    const onResize = () => place(true);
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [place]);

  return { navRef, indRef };
}
