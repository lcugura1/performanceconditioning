// Drive → obrađene fotke + media.json. Preneseno iz capturedwella.
//
//   npm run sync                 # napravi
//   npm run sync -- --dry-run    # samo reci što bi napravio
//   npm run sync -- --names      # ispisuj imena fajlova (samo lokalno)
//
// Kamo piše: R2 bucket ako su postavljeni R2_* ključevi (CI), inače public/media
// na disku, pa `npm run dev` odmah pokazuje fotke s Drivea.
//
// Redoslijed pisanja je namjeran: prvo obrade, pa manifest koji pokazuje na njih,
// pa stanje, i tek onda brisanje. Prekid u bilo kojem trenutku ostavlja fotke bez
// unosa u manifestu (nevidljive), a nikad unose bez fotki (slomljene slike).
import { appendFile } from "node:fs/promises";
import { accessToken } from "./lib/google-auth.mjs";
import { DRIVE_SCOPE, download } from "./lib/drive.mjs";
import { readDrive } from "./lib/drive-sources.mjs";
import { renditions } from "./lib/image-pipeline.mjs";
import { r2FromEnv } from "./lib/r2.mjs";
import { LocalStore } from "./lib/local-store.mjs";
import { buildManifest, buildState, pendingChanges } from "./lib/sync-plan.mjs";
import { required, serviceAccount } from "./lib/env.mjs";

export const MANIFEST_KEY = "media.json";
const STATE_KEY = "sync.json";
export const LOCAL_DIR = "public/media";

/** Godina dana: id u ključu se mijenja čim se promijene pikseli. */
const RENDITION_CACHE = "public, max-age=31536000, immutable";
/** Kratko, jer je ovo jedini fajl čiji se sadržaj mijenja pod istim imenom. */
const MANIFEST_CACHE = "public, max-age=60";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
// Imena fajlova se ne ispisuju po defaultu: Actions log može biti javan.
const NAMES = args.includes("--names");
const label = (source) => (NAMES ? source.name : source.driveId);

const json = (value) => new TextEncoder().encode(`${JSON.stringify(value, null, 2)}\n`);

/** Izlazi za workflow (treba li build, koliko je preskočeno). Izvan Actionsa ništa. */
async function output(values) {
  const path = process.env.GITHUB_OUTPUT;
  if (!path) return;
  await appendFile(path, Object.entries(values).map(([k, v]) => `${k}=${v}\n`).join(""));
}

async function main() {
  const credentials = await serviceAccount();
  const rootId = required("DRIVE_ROOT_FOLDER_ID");
  const useR2 = Boolean(process.env.R2_ACCOUNT_ID);
  const store = useR2 ? r2FromEnv() : new LocalStore(LOCAL_DIR);
  console.log(useR2 ? `Odredište: R2 (${process.env.R2_BUCKET})` : `Odredište: ${LOCAL_DIR} (lokalno, bez R2)`);

  const { token } = await accessToken(credentials, DRIVE_SCOPE);

  // 1. Što je na Driveu.
  const { sources, skipped, missing } = await readDrive(token, rootId);
  for (const name of missing) console.warn(`! mapa "${name}" ne postoji na Driveu, preskačem`);
  for (const { folder, file } of skipped) {
    console.warn(`! ${folder}: ${NAMES ? file.name : file.id} (${file.mimeType}) se ne može obraditi`);
  }

  // 2. Što već postoji i kaže li Drive nešto drugo.
  const [state, published] = await Promise.all([store.getJson(STATE_KEY), store.getJson(MANIFEST_KEY)]);
  const plan = pendingChanges(sources, state, published);
  const stuck = new Set(state?.unreadable ?? []);
  const unreadableOnDrive = sources.filter((s) => stuck.has(s.id));
  for (const source of unreadableOnDrive) console.warn(`! ${label(source)}: ranije nečitljiva, zamijeni fajl na Driveu`);

  console.log(
    `Drive: ${sources.length} fotki · za obradu: ${plan.toBuild.length} · za brisanje: ${plan.toRemove.length}`,
  );

  if (DRY_RUN) {
    for (const source of plan.toBuild) console.log(`  + ${source.page ?? "galerija"} ${label(source)}`);
    for (const { id, kind } of plan.toRemove) console.log(`  - ${kind}/${id}/`);
    console.log(plan.changed ? `  ~ ${MANIFEST_KEY}` : "Nema promjena.");
    console.log("\n--dry-run: ništa nije zapisano.");
    return;
  }

  if (!plan.changed) {
    console.log("Nema promjena.");
    await report(skipped.length + unreadableOnDrive.length, false);
    return;
  }

  // 3. Obrade, jedna po jedna: original od 24 MP u pet širina i tri formata
  //    lako prijeđe gigabajt memorije.
  const built = {};
  const unreadable = [...stuck];
  for (const [i, source] of plan.toBuild.entries()) {
    const bytes = await download(token, source.driveId);
    const result = await renditions(bytes);
    if (!result) {
      console.warn(`! ${label(source)}: sharp ne može pročitati dimenzije, preskačem`);
      unreadable.push(source.id);
      continue;
    }
    for (const file of result.files) {
      await store.put(`${source.kind}/${source.id}/${file.name}`, file.body, {
        contentType: file.contentType,
        cacheControl: RENDITION_CACHE,
      });
    }
    built[source.id] = { width: result.width, height: result.height, widths: result.widths, lqip: result.lqip };
    console.log(
      `  ${String(i + 1).padStart(3)}/${plan.toBuild.length} ${source.page ?? "galerija"} ` +
        `${result.width}x${result.height} → ${result.widths.length} širina × 3 formata`,
    );
  }

  // 4. Manifest iz Drivea i svih poznatih obrada (novih i ranijih).
  const all = { ...(state?.photos ?? {}), ...built };
  const manifest = buildManifest(sources, all, { version: (state?.manifestVersion ?? 0) + 1 });
  await store.put(MANIFEST_KEY, json(manifest), { contentType: "application/json", cacheControl: MANIFEST_CACHE });

  // 5. Stanje, da idući run zna što ne treba ponavljati.
  const next = buildState(sources, all, { unreadable });
  next.manifestVersion = manifest.version;
  await store.put(STATE_KEY, json(next), { contentType: "application/json" });

  // 6. Tek sad brisanje.
  for (const { id, kind } of plan.toRemove) {
    const keys = await store.list(`${kind}/${id}/`);
    for (const key of keys) await store.delete(key);
    console.log(`  - ${kind}/${id}/ (${keys.length} fajlova)`);
  }

  console.log(
    `\n${MANIFEST_KEY} v${manifest.version}: ${Object.keys(manifest.pages).length} slotova, ${manifest.gallery.length} u galeriji`,
  );
  await report(skipped.length + (next.unreadable?.length ?? 0), true);
}

/**
 * Preskočen fajl nije pad synca, ali ne smije proći nezapaženo.
 * Lokalno je to izlazni kod 1; u Actionsu izlaz, pa workflow ipak deploya ostalo.
 */
async function report(failed, changed) {
  await output({ changed, skipped: failed });
  if (failed === 0) return;
  console.warn(`\n${failed} fotk(a/e) preskočeno, Drive id-evi su u upozorenjima iznad.`);
  if (!process.env.GITHUB_OUTPUT) process.exitCode = 1;
}

await main();
