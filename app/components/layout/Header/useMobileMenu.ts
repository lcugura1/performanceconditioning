import { useEffect, useRef, useState } from "react";

// Mora odgovarati $menu-breakpoint u styles/abstracts/_breakpoints.scss.
const DESKTOP_QUERY = "(min-width: 40rem)";

/**
 * Stanje mobilnog izbornika. Zatvara se na Esc (fokus natrag na burger),
 * klik izvan panela i kad ekran postane širi od mobilnog.
 */
export function useMobileMenu() {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      burgerRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || burgerRef.current?.contains(t)) return;
      setOpen(false);
    };
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onMq = (e: MediaQueryListEvent) => e.matches && setOpen(false);

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer, true);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer, true);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  return {
    open,
    toggle: () => setOpen((o) => !o),
    close: () => setOpen(false),
    burgerRef,
    panelRef,
  };
}
