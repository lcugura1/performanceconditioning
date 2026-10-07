// Svakih 5 minuta: je li se na Driveu nešto promijenilo? Ako jest, pokreni sync
// workflow na GitHubu. Ništa drugo. Preneseno iz capturedwella.
//
// Postoji jer GitHub gasi zakazane workflowe u javnom repou nakon 60 dana bez
// commita, a stranica koju Gabrijel puni preko Drivea izgleda upravo tako.
// Workflow ima i vlastiti dnevni raspored kao rezervu.
//
// Namjerno bez fetch() handlera: nema URL-a, nema se što napasti.
// Odluka je pendingChanges(), ista funkcija koju sync zove prije pisanja, nad
// istim Drive popisom, pa run koji ovaj Worker pokrene uvijek nađe posao.
import { accessToken } from "../../../scripts/lib/google-auth.mjs";
import { DRIVE_SCOPE } from "../../../scripts/lib/drive.mjs";
import { readDrive } from "../../../scripts/lib/drive-sources.mjs";
import { dispatch, isRunning } from "../../../scripts/lib/github.mjs";
import { pendingChanges } from "../../../scripts/lib/sync-plan.mjs";

async function readJson(bucket, key) {
  const object = await bucket.get(key);
  return object ? object.json() : null;
}

async function check(env) {
  const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const { token } = await accessToken(credentials, DRIVE_SCOPE);

  const [{ sources }, state, published] = await Promise.all([
    readDrive(token, env.DRIVE_ROOT_FOLDER_ID),
    readJson(env.MEDIA, "sync.json"),
    readJson(env.MEDIA, "media.json"),
  ]);

  const plan = pendingChanges(sources, state, published);
  const counts = `Drive: ${sources.length} · nove: ${plan.toBuild.length} · maknute: ${plan.toRemove.length}`;
  if (!plan.changed) {
    console.log(`${counts} · bez promjena`);
    return;
  }

  if (await isRunning(env.GITHUB_TOKEN, env.GITHUB_REPO, env.GITHUB_WORKFLOW)) {
    // Sync koji radi možda je pročitao Drive prije ove promjene; idući tik to vidi.
    console.log(`${counts} · sync već radi, čekam`);
    return;
  }

  await dispatch(env.GITHUB_TOKEN, env.GITHUB_REPO, env.GITHUB_WORKFLOW, env.GITHUB_REF);
  console.log(`${counts} · pokrenut ${env.GITHUB_WORKFLOW} na ${env.GITHUB_REF}`);
}

export default {
  async scheduled(_controller, env, ctx) {
    // Bez catch: neuspjelo pokretanje vidi se u Cron Events, tamo se vidi i istekao token.
    ctx.waitUntil(check(env));
  },
};
