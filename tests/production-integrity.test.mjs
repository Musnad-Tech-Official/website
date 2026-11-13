import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const source = (path) => readFileSync(join(root, path), "utf8");

test("career applications never report an unpersisted submission", () => {
  const form = source("components/careers/detail/job-application-form.tsx");
  assert.match(form, /mailto:hello@musnad\.tech/);
  assert.doesNotMatch(form, /setIsSubmitted|setTimeout\(|type="file"/);
  for (const locale of ["ar", "en"]) {
    const messages = JSON.parse(source(`messages/${locale}.json`));
    assert.ok(messages.JobDetail.common.form.unavailableTitle);
    assert.ok(messages.JobDetail.common.form.unavailableDescription);
  }
});

test("service mutations require database-confirmed results and no ephemeral persistence", () => {
  const actions = source("lib/services/actions.ts");
  assert.doesNotMatch(actions, /memoryServicesCache|In-memory fallback|INITIAL_SERVICES/);
  assert.match(actions, /\.insert\(/);
  assert.match(actions, /\.update\(/);
  assert.match(actions, /\.delete\(/);
  assert.equal((actions.match(/if \(error \|\| !data\)/g) || []).length, 3);
  assert.match(actions, /\.delete\(\)[\s\S]*?\.select\("id"\)\.single\(\)/);
});

test("company profile and careers use only database-backed public data", () => {
  for (const path of ["lib/about/actions.ts", "lib/careers/actions.ts"]) {
    const actions = source(path);
    assert.doesNotMatch(actions, /FALLBACK_|using fallback/);
    assert.match(actions, /if \(error\) throw error/);
  }
  const jobDetails = source("components/careers/detail/job-detail-template.tsx");
  assert.match(jobDetails, /getCareerJobBySlugAction/);
  assert.doesNotMatch(jobDetails, /datePosted: "2026-01-01"|validThrough: config\.deadlineEn/);
});

test("admin page visibility mutations require confirmed persistence", () => {
  const actions = source("lib/page-control/actions.ts");
  assert.doesNotMatch(actions, /memoryCache|lastFetchTime|Non-fatal if DB|in-memory cache first/);
  assert.match(actions, /Page visibility settings are unavailable/);
  assert.match(actions, /\.upsert\(toDatabaseRow/);
  assert.match(actions, /data\.length !== selected\.length/);
  assert.match(actions, /data\.length !== rows\.length/);
});

test("client brands, endorsements, and tech catalog do not fall back to synthetic success", () => {
  const paths = [
    "lib/companies/actions.ts",
    "lib/testimonials/actions.ts",
    "lib/technologies/actions.ts",
  ];
  for (const path of paths) {
    const actions = source(path);
    assert.doesNotMatch(actions, /In-memory fallback|memoryCompaniesCache|memoryTestimonialsCache|memoryTechCache|INITIAL_TESTIMONIALS/);
    assert.match(actions, /\.insert\(/);
    assert.match(actions, /\.delete\(\)/);
    assert.match(actions, /if \(error \|\| !data\)/);
    assert.match(actions, /\.select\("id"\)\.single\(\)/);
  }
});

test("announcement operations refuse database failures", () => {
  const actions = source("lib/announcements/actions.ts");
  assert.doesNotMatch(actions, /memoryAnnouncementsCache|In-memory fallback/);
  assert.match(actions, /deactivateOtherAnnouncements/);
  assert.match(actions, /restorePreviousAnnouncements/);
  assert.match(actions, /Failed to create announcement/);
  assert.match(actions, /Failed to delete announcement/);
  assert.match(actions, /\.delete\(\)[\s\S]*?\.select\("id"\)\.single\(\)/);
});

test("admin inquiries are never disk-cached and mutations check the affected row", () => {
  const actions = source("lib/inquiries/actions.ts");
  assert.doesNotMatch(actions, /readDiskInquiries|writeDiskInquiries|memoryInquiriesCache|fs\.writeFileSync/);
  assert.match(actions, /await verifyAdminAuth\(\)/);
  assert.match(actions, /Inquiries cannot be loaded from the database/);
  assert.match(actions, /\.update\(payload\)\.eq\("id", id\)\.select\(\)\.single\(\)/);
  assert.match(actions, /\.delete\(\)\.eq\("id", id\)\.select\("id"\)\.single\(\)/);
});

test("dashboard never labels unmeasured security or analytics as healthy", () => {
  const page = source("app/[locale]/admin/page.tsx");
  assert.match(page, /Not live-checked/);
  assert.match(page, /Verify in Vercel/);
  assert.doesNotMatch(page, /Enforced & Active|Active \(Real User\)|Optimal/);
});
