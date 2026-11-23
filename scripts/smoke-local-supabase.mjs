import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";

// Parse "supabase status -o env" without disclosing keys in CI output.
// This script deliberately only connects to the local API at 127.0.0.1.
const content = readFileSync(process.argv[2] || "/tmp/musnad-local-status.env", "utf8");
const fields = new Map();
for (const line of content.split(/\r?\n/)) {
  const match = line.match(/^([A-Z_]+)=(?:"([^"]*)"|'([^']*)'|(.+))$/);
  if (match) fields.set(match[1], match[2] ?? match[3] ?? match[4]);
}
const key = fields.get("ANON_KEY") || fields.get("PUBLISHABLE_KEY");
assert.ok(key && key.length > 30, "Local public API key not found in Supabase status output.");
const url = fields.get("API_URL") || fields.get("SUPABASE_URL");
assert.equal(new URL(url).hostname, "127.0.0.1", "Remote Supabase URL is not permitted.");
const base = new URL(url).origin;

async function get(path) {
  const response = await fetch(base + "/rest/v1/" + path, {
    headers: { apikey: key, Authorization: "Bearer " + key, Accept: "application/json" },
    signal: AbortSignal.timeout(15000),
  });
  const payload = await response.text();
  assert.equal(response.status, 200, "Local PostgREST " + path + " returned HTTP " + response.status + " " + payload.slice(0, 100));
  return JSON.parse(payload);
}

const visible = await get("page_settings?select=id,status&limit=10");
assert.ok(visible.some((row) => row.id === "home"), "Minimum isolated home-page seed was not applied.");
const inquiries = await get("inquiries?select=id&limit=10");
assert.deepEqual(inquiries, [], "Anonymous visitor must not read private inquiries.");
const services = await get("services?select=id&limit=10");
assert.deepEqual(services, [], "Staging must not import fictional marketing services by default.");
console.log("PASS: isolated Supabase Auth/API/PostgREST SQL schema and anonymous RLS checks.");
