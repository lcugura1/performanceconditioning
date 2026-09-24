import { useEffect, useState, type RefObject } from "react";

export const REVEAL_OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.12,
  rootMargin: "0px 0px -6% 0px",
};

/** true kad element prvi put uđe u viewport (i ostaje true). */
export function useInView(
  ref: RefObject<Element | null>,
  options: IntersectionObserverInit = REVEAL_OBSERVER_OPTIONS,
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // opcije su konstantne po pozivu, namjerno nisu u ovisnostima
  }, [ref, inView]);

  return inView;
}
