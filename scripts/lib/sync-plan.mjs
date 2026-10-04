// Što sync treba napraviti, izračunato bez Drivea, R2 i diska.
// Čiste funkcije Drive popisa i zadnjeg stanja: ovo je dio koji odlučuje što se
// briše, pa mora biti predvidljiv. Preneseno iz capturedwella, prilagođeno
// slotovima ove stranice (PAGE_FOLDERS) i jednoj galeriji.
import { DEFAULT_ALT, GALLERY_FOLDER, MAX_BYTES, PAGE_FOLDERS, SUPPORTED_TYPES } from "./media-source.mjs";

const utf8 = new TextEncoder();

/**
 * Id fotke: Drive fajl + njegov sadržaj. Zamijeni sadržaj na Driveu i id se
 * promijeni, pa se promijene i URL-ovi; zato je `immutable` cache siguran.
 */
export async function photoId(driveId, md5) {
  const digest = await crypto.subtle.digest("SHA-256", utf8.encode(`${driveId}:${md5}`));
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 12);
}

/**
 * Broj na početku imena, za ručni redoslijed galerije.
 *   `03 - sprint.jpg` → 3    `02.jpg` → 2    `2026 teren.jpg` → null
 */
const RANK = /^(\d{1,3})(?:\s*[-–—_.)]\s*|\s+|$)/;

export function rankOf(fileName) {
  const match = RANK.exec(fileName.replace(/\.[^.]+$/, ""));
  return match ? Number(match[1]) : null;
}

/**
 * Alt tekst iz imena fajla: bez nastavka i broja na početku.
 * Ime bez razmaka (`IMG_1234`, `@capturedwell_-10_resized`) nije opis, pa tada
 * vrijedi zadani tekst.
 */
export function altFromName(fileName) {
  const base = fileName
    .replace(/\.[^.]+$/, "")
    .replace(RANK, "")
    .trim();
  return /\s/.test(base) ? base : null;
}

export function isUsable(file) {
  return SUPPORTED_TYPES.has(file.mimeType) && Number(file.size ?? 0) <= MAX_BYTES;
}

/** `{putanja: files[]}` → jedan popis izvora; neupotrebljivi fajlovi idu u `skipped`. */
export async function sourcesFrom(byFolder) {
  const sources = [];
  const skipped = [];

  for (const [folder, files] of Object.entries(byFolder)) {
    const page = PAGE_FOLDERS[folder] ?? null;
    const gallery = folder === GALLERY_FOLDER;
    if (!page && !gallery) continue;

    for (const file of files) {
      if (!isUsable(file)) {
        skipped.push({ folder, file });
        continue;
      }
      sources.push({
        id: await photoId(file.id, file.md5Checksum ?? ""),
        driveId: file.id,
        md5: file.md5Checksum ?? "",
        name: file.name,
        mimeType: file.mimeType,
        createdTime: file.createdTime,
        alt: file.description?.trim() || altFromName(file.name) || DEFAULT_ALT,
        rank: rankOf(file.name),
        kind: gallery ? "img" : "page",
        page,
      });
    }
  }

  return { sources, skipped };
}

/**
 * Koje fotke treba obraditi i koje su obrade ostale bez fotke. Prefiks (`kind`)
 * je dio usporedbe: fotka premještena iz galerije u slot ima isti id, ali
 * obrade joj moraju stajati pod `page/`.
 */
export function planSync(sources, state) {
  const known = state?.photos ?? {};
  const unreadable = new Set(state?.unreadable ?? []);
  const wanted = new Map(sources.map((s) => [s.id, s.kind]));

  return {
    toBuild: sources.filter((s) => !unreadable.has(s.id) && known[s.id]?.kind !== s.kind),
    toRemove: Object.entries(known)
      .filter(([id, entry]) => wanted.get(id) !== entry.kind)
      .map(([id, entry]) => ({ id, kind: entry.kind })),
  };
}

const entry = (source, r) => ({
  id: source.id,
  kind: source.kind,
  width: r.width,
  height: r.height,
  widths: r.widths,
  alt: source.alt,
  lqip: r.lqip,
});

/**
 * Manifest koji čita stranica, sastavljen iz Drive popisa i poznatih obrada.
 * Uvijek cijeli: promjena imena ili opisa na Driveu ne traži ponovnu obradu.
 */
export function buildManifest(sources, renditions, { version = 1, now = new Date() } = {}) {
  // Jedna fotka po slotu: najnovija pobjeđuje, pa je zamjena samo ubacivanje nove.
  const pages = {};
  const pageAdded = {};
  for (const source of sources.filter((s) => s.page)) {
    const r = renditions[source.id];
    if (!r) continue;
    if (!pages[source.page] || source.createdTime > pageAdded[source.page]) {
      pages[source.page] = entry(source, r);
      pageAdded[source.page] = source.createdTime;
    }
  }

  // Galerija: numerirane uzlazno (01 prva), zatim nenumerirane od najnovije.
  const gallery = sources
    .filter((s) => s.kind === "img" && renditions[s.id])
    .sort((a, b) => {
      if (a.rank !== null && b.rank !== null) return a.rank - b.rank || a.name.localeCompare(b.name);
      if (a.rank !== null) return -1;
      if (b.rank !== null) return 1;
      return b.createdTime.localeCompare(a.createdTime);
    })
    .map((s) => entry(s, renditions[s.id]));

  return { version, updatedAt: now.toISOString(), pages, gallery };
}

/** Stanje za idući run: dovoljno da se manifest složi bez piksela. */
export function buildState(sources, renditions, { now = new Date(), unreadable = [] } = {}) {
  const photos = {};
  for (const source of sources) {
    const r = renditions[source.id];
    if (!r) continue;
    photos[source.id] = {
      driveId: source.driveId,
      md5: source.md5,
      kind: source.kind,
      width: r.width,
      height: r.height,
      widths: r.widths,
      lqip: r.lqip,
    };
  }
  const present = new Set(sources.map((s) => s.id));
  const stuck = [...new Set(unreadable)].filter((id) => present.has(id));
  return { version: 1, updatedAt: now.toISOString(), photos, ...(stuck.length ? { unreadable: stuck } : {}) };
}

/** Isti sadržaj, bez obzira na `version` i `updatedAt`. */
export function sameManifest(a, b) {
  if (!a || !b) return false;
  const content = (m) => JSON.stringify({ pages: m.pages, gallery: m.gallery });
  return content(a) === content(b);
}

/** Kaže li Drive nešto što objavljena stranica ne kaže. Isto pitanje postavlja i cron Worker. */
export function pendingChanges(sources, state, published) {
  const plan = planSync(sources, state);
  const pixels = plan.toBuild.length > 0 || plan.toRemove.length > 0;
  return { ...plan, changed: pixels || !sameManifest(buildManifest(sources, state?.photos ?? {}), published) };
}
