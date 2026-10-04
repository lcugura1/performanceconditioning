// Provjera Drive pristupa prije prvog synca: prijava service accounta,
// dijeljenje root mape, imena podmapa i broj fotki/dokumenata u njima.
// Ništa ne mijenja, samo čita.
//
// Potrebno (.env lokalno):
//   GOOGLE_SERVICE_ACCOUNT_JSON  – cijeli sadržaj JSON ključa, u jednom retku
//   DRIVE_ROOT_FOLDER_ID         – id mape "stranica"

import { createSign } from "node:crypto";

// Struktura prati sekcije početne stranice (app/content/photos.ts, audiences.ts).
// Putanja → što se u njoj očekuje: "photo" = fotke, "docs" = objavljeni postovi, "ignore" = sync je ne čita.
const AUDIENCE_SLOTS = ["kartica", "usluga", "video"];
const EXPECTED = {
  naslovna: "photo",
  ...Object.fromEntries(
    ["djeca", "sportasi", "rehabilitacija"].flatMap((a) => AUDIENCE_SLOTS.map((s) => [`${a}/${s}`, "photo"])),
  ),
  "programi/osobni-trening": "photo",
  "programi/online": "photo",
  "o-meni": "photo",
  galerija: "photo",
  kontakt: "photo",
  "blog/djeca": "docs",
  "blog/sportasi": "docs",
  "blog/rehabilitacija": "docs",
  "blog/skice": "ignore",
};
const FOLDER = "application/vnd.google-apps.folder";
const DOC = "application/vnd.google-apps.document";

const rootId = process.env.DRIVE_ROOT_FOLDER_ID;
const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

if (!rootId) fail("nema DRIVE_ROOT_FOLDER_ID u .env");
if (!rawKey) fail("nema GOOGLE_SERVICE_ACCOUNT_JSON u .env");

let key;
try {
  key = JSON.parse(rawKey);
} catch {
  fail("GOOGLE_SERVICE_ACCOUNT_JSON nije ispravan JSON (mora biti u jednom retku)");
}

const b64url = (v) => Buffer.from(typeof v === "string" ? v : JSON.stringify(v)).toString("base64url");

async function accessToken() {
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64url({ alg: "RS256", typ: "JWT" })}.${b64url({
    iss: key.client_email,
    scope: "https://www.googleapis.com/auth/drive.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(key.private_key, "base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
  });
  if (!res.ok) fail(`prijava service accounta nije uspjela (${res.status}): ${await res.text()}`);
  return (await res.json()).access_token;
}

const token = await accessToken();
console.log(`✓ prijava: ${key.client_email}`);

async function drive(path, params) {
  const url = new URL(`https://www.googleapis.com/drive/v3/${path}`);
  for (const [k, v] of Object.entries({ supportsAllDrives: "true", ...params })) url.searchParams.set(k, v);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (res.ok) return res.json();
  const body = await res.text();
  if (res.status === 403 && /SERVICE_DISABLED|accessNotConfigured/.test(body)) {
    fail("Google Drive API nije uključen u projektu (Cloud Console → APIs & Services → Library → Google Drive API → Enable)");
  }
  if (res.status === 404) {
    fail(`mapa ${params?.q ?? path} nije vidljiva: nije podijeljena s ${key.client_email} ili je id kriv`);
  }
  fail(`Drive API ${res.status}: ${body}`);
}

async function children(folderId) {
  const files = [];
  let pageToken;
  do {
    const page = await drive("files", {
      q: `'${folderId}' in parents and trashed = false`,
      fields: "nextPageToken, files(id, name, mimeType)",
      pageSize: "1000",
      includeItemsFromAllDrives: "true",
      ...(pageToken && { pageToken }),
    });
    files.push(...page.files);
    pageToken = page.nextPageToken;
  } while (pageToken);
  return files;
}

const root = await drive(`files/${rootId}`, { fields: "id, name, mimeType" });
if (root.mimeType !== FOLDER) fail(`DRIVE_ROOT_FOLDER_ID pokazuje na "${root.name}", a to nije mapa`);
console.log(`✓ root mapa podijeljena: "${root.name}"`);

const describe = (files) => {
  const images = files.filter((f) => /^image\/(jpeg|png)$/.test(f.mimeType)).length;
  const docs = files.filter((f) => f.mimeType === DOC).length;
  const skipped = files.filter((f) => f.mimeType.startsWith("image/") && !/^image\/(jpeg|png)$/.test(f.mimeType)).length;
  return [`${images} fotki`, docs && `${docs} dokumenata`, skipped && `${skipped} preskočeno (HEIC/RAW…)`]
    .filter(Boolean)
    .join(", ");
};

/** Rekurzivno: putanja ("djeca/kartica") → { id, files } za svaku mapu ispod roota. */
async function walk(folderId, prefix = "", out = new Map()) {
  const files = await children(folderId);
  if (prefix) out.set(prefix, { id: folderId, files });
  for (const f of files.filter((f) => f.mimeType === FOLDER)) {
    await walk(f.id, prefix ? `${prefix}/${f.name}` : f.name, out);
  }
  return out;
}

const tree = await walk(rootId);
let missing = 0;

for (const [path, kind] of Object.entries(EXPECTED)) {
  const node = tree.get(path);
  if (!node) {
    console.log(`  – ${path}/ nema`);
    missing++;
  } else if (kind === "docs") {
    console.log(`  ✓ ${path}/: ${node.files.filter((f) => f.mimeType === DOC).length} objavljenih postova`);
  } else if (kind === "ignore") {
    console.log(`  ✓ ${path}/ (sync je ne čita)`);
  } else {
    console.log(`  ✓ ${path}/: ${describe(node.files)}`);
  }
}

// Mape koje nisu ni očekivane ni roditelj očekivane (npr. stara "usluge" ili "blog/objavljeno").
const known = (p) => p in EXPECTED || Object.keys(EXPECTED).some((e) => e.startsWith(`${p}/`));
const extra = [...tree.keys()].filter((p) => !known(p));
if (extra.length) console.log(`  ? mape koje sync ne poznaje (obriši ih): ${extra.join(", ")}`);

console.log(missing ? `\n${missing} mapa nedostaje; napravi ih točno ovim imenima.` : "\n✓ sve mape su na mjestu");
