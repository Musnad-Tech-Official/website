import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, relative, dirname } from "node:path";
import assert from "node:assert/strict";

/**
 * Generates an isolated local Supabase schema migration from the reviewed
 * repository SQL source files. Never imports seed claims (people, clients,
 * projects, testimonials, careers). Storage buckets remain configuration.
 * Call only after "supabase migration new local_schema" created an empty file.
 */
const output = process.argv[2];
if (!output) throw Error("Usage: node scripts/build-local-supabase-schema.mjs supabase/migrations/<new>.sql");
const abs = resolve(output);
const rel = relative(resolve("supabase/migrations"), abs).replaceAll("\\", "/");
if (!rel || rel.startsWith("../") || rel.startsWith("/") || !/^\d{14}_[a-z0-9_]+\.sql$/.test(rel)) {
  throw Error("Refusing migration output outside a CLI-generated supabase/migrations file.");
}

const source = [
  ["articles.sql", "full"],
  ["projects.sql", "-- 4. Seed Approved Initial Production Projects"],
  ["team.sql", "INSERT INTO public.team_members"],
  ["about.sql", "INSERT INTO public.about_content"],
  ["announcements.sql", "INSERT INTO public.announcements"],
  ["careers.sql", "INSERT INTO public.career_jobs"],
  ["comments_and_newsletter.sql", "full"],
  ["faqs.sql", "INSERT INTO public.faq_topics"],
  ["inquiries.sql", "INSERT INTO public.inquiries"],
  ["page_visibility.sql", "INSERT INTO public.page_settings"],
  ["services.sql", "INSERT INTO public.services"],
  ["technologies.sql", "INSERT INTO public.technologies"],
  ["testimonials.sql", "INSERT INTO public.testimonials"],
  ["trusted_companies.sql", "INSERT INTO public.trusted_companies"],
  ["2026-11-09-harden-article-comments-rls.sql", "full"],
];

const sqlSections = [];
for (const [filename, cutoff] of source) {
  const original = readFileSync("supabase/sql/" + filename, "utf8");
  const offset = cutoff === "full" ? original.length : original.indexOf(cutoff);
  assert.ok(offset > 500, "Missing reviewed cutoff marker in " + filename);
  const ddl = original.slice(0, offset).trim();
  if (filename !== "2026-11-09-harden-article-comments-rls.sql") {
    assert.match(ddl, /CREATE TABLE\s+IF NOT EXISTS/i, "Missing table DDL in " + filename);
  }
  // Storage bucket registration is internal config, not marketing/customer data.
  // Reject accidental marketing seeds and customer contact details in migrations.
  if (/\bINSERT INTO public\.(?:inquiries|projects|testimonials|team_members|career_jobs|trusted_companies|articles|services|announcements|faqs|page_settings)\b/i.test(ddl)) {
    throw Error("Refusing public customer/marketing seed in " + filename);
  }
  sqlSections.push("-- SOURCE: supabase/sql/" + filename + "\n" + ddl);
}

const generated = [
  "-- Musnad Tech LOCAL/CI ONLY: schema and RLS, no imported production data.",
  "-- Generated from checked-in supabase/sql/*.sql; never deploy to hosted project.",
  "BEGIN;",
  ...sqlSections,
  "COMMIT;",
  "",
].join("\n\n");
mkdirSync(dirname(abs), { recursive: true });
writeFileSync(abs, generated, { flag: "w" });
console.log("Generated schema-only local Supabase migration from " + source.length + " reviewed files.");
