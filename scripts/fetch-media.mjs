// Spušta media.json (manifest fotki s Drivea) u app/content/media.json, da ga build
// može uvesti. Pokreće se prije `dev`, `build` i `typecheck`.
//
// Izvor, redom:
//   1. MEDIA_BASE (npr. https://img.performanceconditioning.hr), kad je postavljen
//   2. public/media/media.json, koji napiše lokalni `npm run sync` bez R2
//   3. postojeća app/content/media.json (offline)
//   4. prazan manifest: stranica tada koristi fotke iz public/images
//
// Uvijek ostavi čitljiv fajl, jer bez njega se stranica ne može ni pokrenuti.
import { mkdir, readFile, writeFile } from "node:fs/promises";

const OUT = "app/content/media.json";
const LOCAL = "public/media/media.json";
const EMPTY = { version: 0, updatedAt: new Date(0).toISOString(), pages: {}, gallery: [] };

const readJson = async (path) => {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return null;
  }
};

async function remote(base) {
  // Vlastiti query string: edge ignorira no-cache i inače bi build sekundama nakon
  // synca dobio stari manifest.
  const res = await fetch(`${base}/media.json?t=${Date.now()}`, { headers: { "cache-control": "no-cache" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function main() {
  const base = process.env.MEDIA_BASE?.replace(/\/$/, "");
  let manifest = null;
  let from = "";

  if (base) {
    try {
      manifest = { ...(await remote(base)), base };
      from = base;
    } catch (error) {
      console.warn(`! ${base}/media.json nedostupan (${error.message})`);
    }
  }
  if (!manifest) {
    const local = await readJson(LOCAL);
    if (local) {
      manifest = { ...local, base: "/media" };
      from = LOCAL;
    }
  }
  if (!manifest) {
    if (await readJson(OUT)) {
      console.warn(`! nema novog manifesta, koristim postojeći ${OUT}`);
      return;
    }
    console.warn("! nema manifesta fotki: stranica koristi fotke iz public/images. Pokreni `npm run sync`.");
    manifest = { ...EMPTY, base: "" };
    from = "prazan";
  }

  await mkdir("app/content", { recursive: true });
  await writeFile(OUT, `${JSON.stringify(manifest, null, 2)}\n`);
  if (from !== "prazan") {
    console.log(
      `media.json v${manifest.version} (${from}): ${Object.keys(manifest.pages).length} slotova, ${manifest.gallery.length} u galeriji`,
    );
  }
}

await main();
