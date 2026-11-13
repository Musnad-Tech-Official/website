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
