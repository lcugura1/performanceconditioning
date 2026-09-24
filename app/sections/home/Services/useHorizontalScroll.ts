import { useEffect, useRef } from "react";
import { useScrollFrame } from "~/hooks/useScrollFrame";

/**
 * Pinned vodoravni skrol: sekcija je visoka koliko sticky kontejner + višak širine
 * tracka, a track se pomiče ulijevo proporcionalno skrolu kroz sekciju.
 * Napredak (0–1) izlaže se kao CSS varijabla --p na sekciji (traka napretka).
 */
export function useHorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const distance = useRef(0);

  const update = () => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!section || !sticky || !track) return;

    const r = section.getBoundingClientRect();
    const total = r.height - sticky.offsetHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    track.style.transform = `translate3d(${(-p * distance.current).toFixed(1)}px,0,0)`;
    section.style.setProperty("--p", p.toFixed(4));
  };

  // Preračunaj visinu kad se promijeni širina tracka (resize, fontovi, slike).
  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!section || !sticky || !track) return;

    const measure = () => {
      distance.current = Math.max(0, track.scrollWidth - sticky.clientWidth);
      section.style.height = `${sticky.offsetHeight + distance.current}px`;
      update();
    };

    const ro = new ResizeObserver(measure);
    ro.observe(track);
    ro.observe(sticky);
    return () => ro.disconnect();
  }, []);

  useScrollFrame(update);

  return { sectionRef, stickyRef, trackRef };
}
