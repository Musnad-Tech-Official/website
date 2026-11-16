import { readFileSync, writeFileSync, existsSync, unlinkSync, appendFileSync, chmodSync } from "node:fs";

const BASE = "https://api.clerk.com/v1";
const EXPECTED_DEV_INSTANCE = "ins_3Jh9aqeyl9ZCWZL6gzZs9iBEB1w";
const EXPECTED_PUBLISHABLE = "pk_test_dmlhYmxlLW1vdGgtMTgxNC5jbGVyay5hY2NvdW50cy5kZXYk";
const STATE = "/tmp/musnad-clerk-dev-e2e-users.json";
const command = process.argv[2];

function ensureSafeEnvironment() {
  const secret = process.env.CLERK_SECRET_KEY || "";
  if (!secret.startsWith("sk_test_")) throw Error("Refusing non-development Clerk secret.");
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== EXPECTED_PUBLISHABLE) {
    throw Error("Refusing a different Clerk instance.");
  }
  if (process.env.E2E_BASE_URL !== "http://localhost:3000" ||
      process.env.NEXT_PUBLIC_SITE_URL !== "http://localhost:3000" ||
      process.env.E2E_STAGING_SUPABASE_URL !== "http://127.0.0.1:54321" ||
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "http://127.0.0.1:54321" ||
      process.env.E2E_ISOLATED_DATABASE_CONFIRMED !== "true") {
    throw Error("Refusing Clerk test users outside isolated local E2E.");
  }
  return secret;
}

async function request(secret, method, path, payload) {
  const response = await fetch(BASE + path, {
    method,
    headers: {
      Authorization: "Bearer " + secret,
      "Content-Type": "application/json",
    },
    ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) {
    // No raw provider response (could include PII or credential data) in CI logs.
    if (method === "GET" && response.status === 404) return null;
    throw Error("Clerk Development " + method + " request failed, HTTP " + response.status + ".");
  }
  if (response.status === 204) return null;
  return response.json();
}

function save(users) {
  writeFileSync(STATE, JSON.stringify(users), { mode: 0o600 });
  chmodSync(STATE, 0o600);
}

async function ensureInstance(secret) {
  const instance = await request(secret, "GET", "/instance");
  if (!instance || instance.id !== EXPECTED_DEV_INSTANCE ||
      instance.environment_type !== "development") {
    throw Error("Refusing to operate: Clerk Backend API does not identify expected development instance.");
  }
}

function testEmail(role) {
  const run = process.env.GITHUB_RUN_ID;
  const attempt = process.env.GITHUB_RUN_ATTEMPT || "1";
  if (!/^[0-9]{5,20}$/.test(run || "") || !/^[0-9]{1,8}$/.test(attempt)) {
    throw Error("Dedicated GitHub Actions run identifier required.");
  }
  return "musnad-e2e+clerk_test_" + role + "_" + run + "_" + attempt + "@example.com";
}

async function cleanup(secret, users) {
  let failed = false;
  for (const user of users) {
    if (!/^user_[\w-]+$/.test(user.id) ||
        !/^musnad-e2e\+clerk_test_(admin|member)_[0-9]+_[0-9]+@example\.com$/.test(user.email)) {
      throw Error("Refusing cleanup of a user without the synthetic test marker.");
    }
    try {
      const remote = await request(secret, "GET", "/users/" + encodeURIComponent(user.id));
      if (remote) {
        const emailMatches = (remote.email_addresses || []).some((entry) => entry.email_address === user.email);
        if (!emailMatches) throw Error("Synthetic email marker mismatch: refusing deletion.");
        await request(secret, "DELETE", "/users/" + encodeURIComponent(user.id));
      }
    } catch (err) {
      failed = true;
      console.error(err instanceof Error ? err.message : "Clerk cleanup failed.");
    }
  }
  if (failed) throw Error("Not all dedicated Clerk Development test users were cleaned up.");
  if (existsSync(STATE)) unlinkSync(STATE);
  console.log("Dedicated Clerk Development E2E test users cleaned up.");
}

async function main() {
  const secret = ensureSafeEnvironment();
  await ensureInstance(secret);
  if (command === "cleanup") {
    if (!existsSync(STATE)) {
      console.log("No generated test users to clean up.");
      return;
    }
    await cleanup(secret, JSON.parse(readFileSync(STATE, "utf8")));
    return;
  }
  if (command !== "create") throw Error("Usage: node scripts/e2e-clerk-dev-users.mjs create|cleanup");
  if (existsSync(STATE)) throw Error("Refusing to overwrite prior test-user cleanup state.");
  const users = [];
  try {
    for (const role of ["admin", "member"]) {
      const email = testEmail(role);
      const created = await request(secret, "POST", "/users", {
        email_address: [email],
        skip_password_requirement: true,
      });
      if (!created?.id || !/^user_[\w-]+$/.test(created.id)) {
        throw Error("Clerk returned an invalid synthetic user ID.");
      }
      users.push({ id: created.id, email, role });
      save(users); // Persist each ID immediately so partial setup can be cleaned.
      const updated = await request(secret, "PATCH", "/users/" + encodeURIComponent(created.id) + "/metadata", {
        public_metadata: { role: role === "admin" ? "admin" : "member" },
      });
      if (updated?.public_metadata?.role !== role) {
        throw Error("Clerk development test role metadata not confirmed.");
      }
    }
    const output = process.env.GITHUB_ENV;
    if (!output) throw Error("GitHub Actions environment output required.");
    appendFileSync(output, "E2E_ADMIN_EMAIL=" + users[0].email + "\n");
    appendFileSync(output, "E2E_MEMBER_EMAIL=" + users[1].email + "\n");
    console.log("Created two uniquely named Clerk Development-only test accounts; roles verified.");
  } catch (error) {
    await cleanup(secret, users);
    throw error;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Unexpected Clerk test setup error.");
  process.exitCode = 1;
});
