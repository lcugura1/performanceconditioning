import { useEffect, useRef, useState } from "react";

// Mora odgovarati breakpointu "nav" (1100px) u styles/abstracts/_breakpoints.scss.
const DESKTOP_QUERY = "(min-width: 1101px)";

/**
 * Stanje mobilnog izbornika. Zatvara se na Esc (fokus natrag na burger)
 * i kad ekran postane širi od breakpointa za navigaciju.
 */
export function useMobileMenu() {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      burgerRef.current?.focus();
    };
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onMq = (e: MediaQueryListEvent) => e.matches && setOpen(false);

    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  return {
    open,
    toggle: () => setOpen((o) => !o),
    close: () => setOpen(false),
    burgerRef,
  };
}
