import { useEffect, useRef } from "react";
import { subscribeScrollFrame } from "~/lib/scroll-frame";

/**
 * Poziva `fn` na svaki scroll/resize (najviše jednom po frameu) i odmah pri mountu.
 * `fn` smije čitati layout i pisati stil izravno na DOM — tako izbjegavamo
 * React re-render na svaki frame.
 */
export function useScrollFrame(fn: () => void) {
  const latest = useRef(fn);
  latest.current = fn;

  useEffect(() => {
    const run = () => latest.current();
    run();
    return subscribeScrollFrame(run);
  }, []);
}
