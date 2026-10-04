// Sve na Driveu što stranica može prikazati, kao izvori za sync.
// Bez node:* importa, da ga kasnije može koristiti i cron Worker (isti pogled na Drive).
import { FOLDER_TYPE, listFolder } from "./drive.mjs";
import { EXPECTED_FOLDERS } from "./media-source.mjs";
import { sourcesFrom } from "./sync-plan.mjs";

/**
 * Prolazi samo očekivane putanje (npr. "djeca/kartica"), jednu razinu po razinu.
 * `missing` su mape kojih nema: nije greška, ali preimenovana mapa izgleda isto
 * kao ispražnjena, pa vrijedi reći.
 */
export async function readDrive(token, rootId) {
  const folderIds = new Map([["", rootId]]);
  const byFolder = {};
  const missing = [];

  for (const path of EXPECTED_FOLDERS) {
    const parts = path.split("/");
    let parent = "";
    let found = true;
    for (const part of parts) {
      const current = parent ? `${parent}/${part}` : part;
      if (!folderIds.has(current)) {
        const parentId = folderIds.get(parent);
        const children = parentId ? await listFolder(token, parentId) : [];
        for (const f of children.filter((f) => f.mimeType === FOLDER_TYPE)) {
          folderIds.set(parent ? `${parent}/${f.name}` : f.name, f.id);
        }
        // Zapamti i da je roditelj pregledan, da se ne lista dvaput.
        if (!folderIds.has(current)) folderIds.set(current, null);
      }
      if (!folderIds.get(current)) {
        found = false;
        break;
      }
      parent = current;
    }
    if (!found) {
      missing.push(path);
      continue;
    }
    byFolder[path] = (await listFolder(token, folderIds.get(path))).filter((f) => f.mimeType !== FOLDER_TYPE);
  }

  return { ...(await sourcesFrom(byFolder)), missing };
}
