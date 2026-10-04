import { useSyncExternalStore } from "react";
import { audiences } from "~/content/audiences";
import type { Audience } from "~/content/types";

const KEY = "pc:audience";
/** ?za=djeca|sportasi|rehab — za linkove iz oglasa i s Instagrama */
const PARAM = "za";

const isAudience = (v: unknown): v is Audience => audiences.some((a) => a.id === v);

function save(a: Audience) {
  try {
    localStorage.setItem(KEY, a);
  } catch {
    /* privatni prozor / blokiran storage — odabir vrijedi do osvježavanja */
  }
}

/** URL parametar ima prednost pred spremljenim odabirom i sprema se. */
function read(): Audience | null {
  const fromUrl = new URLSearchParams(location.search).get(PARAM);
  if (isAudience(fromUrl)) {
    save(fromUrl);
    return fromUrl;
  }
  try {
    const stored = localStorage.getItem(KEY);
    return isAudience(stored) ? stored : null;
  } catch {
    return null;
  }
}

let current: Audience | null | undefined; // undefined = još nije pročitano
const listeners = new Set<() => void>();

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

function getSnapshot() {
  if (current === undefined) current = read();
  return current;
}

export function setAudience(a: Audience) {
  current = a;
  save(a);
  listeners.forEach((notify) => notify());
}

/**
 * Skupina koju je posjetitelj odabrao, ili null. Na serveru i pri hidrataciji
 * uvijek null (prerender je u zadanom redoslijedu), pa nema mismatcha.
 */
export function useAudience() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

/** Odabrana skupina prva, ostale u zadanom redoslijedu; bez odabira lista ostaje ista. */
export function orderByAudience<T>(list: T[], selected: Audience | null, of: (item: T) => Audience) {
  if (!selected) return list;
  return [...list.filter((x) => of(x) === selected), ...list.filter((x) => of(x) !== selected)];
}
