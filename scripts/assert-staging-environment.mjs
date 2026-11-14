/**
 * Preflight: no E2E should run on production, even when somebody supplies
 * production's URL as a "staging" target. This cannot validate Vercel runtime
 * configuration; a separate, verified branch-specific env override is required.
 */
const vars = [
  "E2E_BASE_URL",
  "E2E_STAGING_SUPABASE_URL",
  "E2E_STAGING_CLERK_PUBLISHABLE_KEY",
];
const missing = vars.filter((name) => !process.env[name]?.trim());
function stop(message) {
  console.error("Staging E2E blocked: " + message);
  process.exit(1);
}
if (missing.length) stop("Missing " + missing.join(", "));

let app;
let db;
try {
  app = new URL(process.env.E2E_BASE_URL);
  db = new URL(process.env.E2E_STAGING_SUPABASE_URL);
} catch {
  stop("Invalid staging URLs.");
}

if (!["http:", "https:"].includes(app.protocol)) stop("Invalid target protocol.");
if (app.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(app.hostname)) {
  stop("Remote staging requires HTTPS.");
}
if (["musnadtech.com", "www.musnadtech.com"].includes(app.hostname)) {
  stop("Production website is forbidden as an E2E target.");
}
const isLocalApp = ["localhost", "127.0.0.1"].includes(app.hostname);
const isLocalDb = ["localhost", "127.0.0.1"].includes(db.hostname);
if (isLocalApp !== isLocalDb) {
  stop("Local database must be paired with a local application.");
}
if (isLocalDb) {
  if (db.protocol !== "http:" || db.port !== "54321") {
    stop("Local Supabase must use its expected HTTP API port 54321.");
  }
} else if (db.protocol !== "https:" || !/^[a-z0-9-]+\.supabase\.co$/.test(db.hostname)) {
  stop("Remote staging requires a distinct Supabase project over HTTPS.");
}
if (db.hostname === "zlqfoymxladqwkfliuko.supabase.co") {
  stop("Production database cannot be used for tests.");
}
if (!process.env.E2E_STAGING_CLERK_PUBLISHABLE_KEY.startsWith("pk_test_")) {
  stop("Clerk development publishable key required.");
}
if (process.env.E2E_ISOLATED_DATABASE_CONFIRMED !== "true") {
  stop("Confirm isolated local or Preview values and set E2E_ISOLATED_DATABASE_CONFIRMED=true.");
}
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  let runtime;
  try { runtime = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL); }
  catch { stop("Runtime Supabase URL is invalid."); }
  if (runtime.origin !== db.origin) stop("Runtime Supabase URL does not match staging.");
}
if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== process.env.E2E_STAGING_CLERK_PUBLISHABLE_KEY) {
  stop("Runtime Clerk key does not match staging.");
}
console.log("Staging target preflight passed. No credentials disclosed.");
