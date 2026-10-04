// Isto sučelje kao R2 klasa (get, getJson, put, delete, list), ali na disku.
// Lokalni sync bez R2 ključeva piše u public/media, pa `npm run dev` odmah
// poslužuje fotke s Drivea. Na produkciji isti kod piše u R2.
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

export class LocalStore {
  constructor(dir) {
    this.dir = dir;
  }

  async get(key) {
    try {
      return new Uint8Array(await readFile(join(this.dir, key)));
    } catch (error) {
      if (error.code === "ENOENT") return null;
      throw error;
    }
  }

  async getJson(key) {
    const bytes = await this.get(key);
    return bytes ? JSON.parse(new TextDecoder().decode(bytes)) : null;
  }

  async put(key, body) {
    const path = join(this.dir, key);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, body);
  }

  async delete(key) {
    await rm(join(this.dir, key), { force: true });
  }

  async list(prefix) {
    const base = join(this.dir, prefix);
    try {
      const entries = await readdir(base, { recursive: true, withFileTypes: true });
      return entries.filter((e) => e.isFile()).map((e) => relative(this.dir, join(e.parentPath, e.name)));
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }
}
