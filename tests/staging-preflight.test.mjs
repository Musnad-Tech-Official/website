import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { join } from "node:path";

const guard = join(process.cwd(), "scripts", "assert-staging-environment.mjs");
const values = {
  E2E_BASE_URL: "https://staging-preview.example.invalid",
  E2E_STAGING_SUPABASE_URL: "https://staging-isolated.supabase.co",
  E2E_STAGING_CLERK_PUBLISHABLE_KEY: "pk_test_fixture_only",
  E2E_ISOLATED_DATABASE_CONFIRMED: "true",
  NEXT_PUBLIC_SUPABASE_URL: "",
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "",
};

function check(overrides) {
  return spawnSync(process.execPath, [guard], {
    encoding: "utf8",
    env: { ...process.env, ...values, ...overrides },
  });
}

test("a declared isolated staging target passes local preflight", () => {
  assert.equal(check({}).status, 0);
});

test("production site never passes staging preflight", () => {
  assert.notEqual(check({ E2E_BASE_URL: "https://musnadtech.com" }).status, 0);
  assert.notEqual(check({ E2E_BASE_URL: "https://www.musnadtech.com/ar" }).status, 0);
});

test("production Supabase project never passes staging preflight", () => {
  assert.notEqual(check({
    E2E_STAGING_SUPABASE_URL: "https://zlqfoymxladqwkfliuko.supabase.co",
  }).status, 0);
});

test("unconfirmed isolation is rejected", () => {
  assert.notEqual(check({ E2E_ISOLATED_DATABASE_CONFIRMED: "false" }).status, 0);
});

test("live Clerk publishable key is rejected", () => {
  assert.notEqual(check({ E2E_STAGING_CLERK_PUBLISHABLE_KEY: "pk_live_fixture" }).status, 0);
});

test("runtime Supabase URL must match declared staging project", () => {
  assert.notEqual(check({ NEXT_PUBLIC_SUPABASE_URL: "https://zlqfoymxladqwkfliuko.supabase.co" }).status, 0);
});

test("runtime Clerk key must match development instance", () => {
  assert.notEqual(check({ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_another_fixture" }).status, 0);
});

test("a missing target refuses to proceed", () => {
  assert.notEqual(check({ E2E_BASE_URL: "" }).status, 0);
});
