import { useCallback, useEffect, useState } from "react";

function readFlag(key: string) {
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false; // privatni prozor / blokiran storage
  }
}

function writeFlag(key: string) {
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    /* nije kritično */
  }
}

/** Otvara se nakon `delayMs`, najviše jednom po posjeti (sessionStorage). */
export function useDelayedOncePerSession(key: string, delayMs: number) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (readFlag(key)) return;
    const t = setTimeout(() => {
      writeFlag(key);
      setOpen(true);
    }, delayMs);
    return () => clearTimeout(t);
  }, [key, delayMs]);

  const close = useCallback(() => setOpen(false), []);
  return [open, close] as const;
}
