import { readFileSync, appendFileSync } from "node:fs";
import assert from "node:assert/strict";

const [statusPath, githubEnv] = process.argv.slice(2);
assert.ok(statusPath && githubEnv, "Usage: node scripts/export-local-supabase-ci.mjs <status-env> <github-env>");
const lines = readFileSync(statusPath, "utf8").split(/\r?\n/);
const env = new Map();
for (const line of lines) {
  const match = line.match(/^([A-Z_]+)=(?:"([^"]*)"|'([^']*)'|(.+))$/);
  if (match) env.set(match[1], match[2] ?? match[3] ?? match[4]);
}
const api = env.get("API_URL") || env.get("SUPABASE_URL");
const key = env.get("ANON_KEY") || env.get("PUBLISHABLE_KEY");
assert.ok(api && key, "Local API credentials missing");
const u = new URL(api);
assert.equal(u.hostname, "127.0.0.1", "Cannot export non-local Supabase credentials");
assert.equal(u.port, "54321", "Wrong local Supabase API port");
assert.ok(key.length > 30, "Invalid local API public key");
const db = u.origin;

// Local runner only: public anon JWT. Never export service_role.
appendFileSync(githubEnv, "NEXT_PUBLIC_SUPABASE_URL=" + db + "\n");
appendFileSync(githubEnv, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=" + key + "\n");
appendFileSync(githubEnv, "E2E_STAGING_SUPABASE_URL=" + db + "\n");
console.log("Local Supabase API URL and public key exported (key redacted).");
