import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const role = { userId: "test-admin", sessionClaims: { metadata: { role: "admin" } } };
const inventory = [{
  id: "about",
  path: "/about",
  titleEn: "About",
  titleAr: "من نحن",
  family: "marketing",
  status: "live",
  showInNavbar: true,
  showInFooter: true,
  isProtected: false,
}];

function database(respond) {
  return {
    from(table) {
      let operation = "select";
      const query = new Proxy({}, {
        get(_, name) {
          if (name === "then") {
            return (resolve, reject) => Promise.resolve(respond({ table, operation })).then(resolve, reject);
          }
          if (name === "single" || name === "maybeSingle") {
            return () => Promise.resolve(respond({ table, operation }));
          }
          return () => {
            if (["insert", "update", "delete", "upsert"].includes(name)) operation = name;
            return query;
          };
        },
      });
      return query;
    },
  };
}

function loadAction(path, respond, session = role) {
  const source = readFileSync(join(process.cwd(), path), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
    },
  }).outputText;

  const localModule = { exports: {} };
  const mocks = {
    "@clerk/nextjs/server": { auth: async () => session },
    "@/utils/supabase/server": { createClient: async () => database(respond) },
    "next/cache": { revalidatePath: () => {} },
    "./inventory": { MASTER_PAGE_INVENTORY: inventory },
  };
  const mockRequire = (name) => {
    if (name in mocks) return mocks[name];
    if (name.startsWith("./") || name.startsWith("@/")) return {};
    return require(name);
  };
  // Transpiled code is repository-local TypeScript, executed with isolated mocks.
  const run = new Function("require", "module", "exports", "crypto", output);
  run(mockRequire, localModule, localModule.exports, { randomUUID: () => "mock-uuid" });
  return localModule.exports;
}

const denied = () => ({ data: null, error: { code: "RLS_DENIED" } });
const notFound = () => ({ data: null, error: null });

test("visibility controls refuse write errors and missing target rows", async () => {
  const readRow = {
    id: "about",
    path: "/about",
    status: "live",
    show_in_navbar: true,
    show_in_footer: true,
  };
  const actions = loadAction("lib/page-control/actions.ts", ({ operation }) => (
    operation === "select" ? { data: [readRow], error: null } : denied()
  ));
  const result = await actions.updatePageControlAction("about", { status: "hidden" });
  assert.equal(result.success, false);
  const missing = loadAction("lib/page-control/actions.ts", ({ operation }) => (
    operation === "select" ? { data: [readRow], error: null } : notFound()
  ));
  assert.equal((await missing.updatePageControlAction("about", { status: "hidden" })).success, false);
  await assert.rejects(loadAction("lib/page-control/actions.ts", denied).getPageControlsAction());
});

test("technology mutations never report success on a rejected database write", async () => {
  const actions = loadAction("lib/technologies/actions.ts", denied);
  assert.equal((await actions.toggleTechnologyHomeAction("react", false)).success, false);
  assert.equal((await actions.deleteTechnologyAction("react")).success, false);
  assert.equal((await actions.addTechnologyAction({ id: "react", name: "React" })).success, false);
});

test("partner and testimonial mutations do not fall back to in-memory saves", async () => {
  const companies = loadAction("lib/companies/actions.ts", denied);
  assert.equal((await companies.createCompanyAction({
    id: "company", nameEn: "Company", nameAr: "شركة", logo: "", displayOrder: 1,
  })).success, false);
  assert.equal((await companies.deleteCompanyAction("company")).success, false);

  const testimonials = loadAction("lib/testimonials/actions.ts", denied);
  assert.equal((await testimonials.createTestimonialAction({
    id: "quote", authorNameEn: "Author", authorNameAr: "كاتب",
    roleEn: "Role", roleAr: "دور", quoteEn: "Quote", quoteAr: "نص", displayOrder: 1,
  })).success, false);
  assert.equal((await testimonials.deleteTestimonialAction("quote")).success, false);
});

test("announcement writes require successful persistence", async () => {
  const actions = loadAction("lib/announcements/actions.ts", denied);
  assert.equal((await actions.createAnnouncementAction({
    id: "banner", category: "general", textEn: "Text", textAr: "نص", href: "/",
    isActive: false,
  })).success, false);
  assert.equal((await actions.updateAnnouncementAction("banner", { textEn: "Updated" })).success, false);
  assert.equal((await actions.deleteAnnouncementAction("banner")).success, false);
});

test("private inquiry changes require a confirmed affected row", async () => {
  const actions = loadAction("lib/inquiries/actions.ts", denied);
  assert.equal((await actions.updateInquiryStatusAction("missing", "read")).success, false);
  assert.equal((await actions.deleteInquiryAction("missing")).success, false);
  await assert.rejects(actions.getInquiriesAction());
});

test("non-admin callers cannot mutate protected dashboard content", async () => {
  const user = { userId: "test-user", sessionClaims: { metadata: { role: "member" } } };
  const actions = loadAction("lib/technologies/actions.ts", denied, user);
  const result = await actions.deleteTechnologyAction("react");
  assert.equal(result.success, false);
  assert.match(result.error, /Forbidden/);
});
