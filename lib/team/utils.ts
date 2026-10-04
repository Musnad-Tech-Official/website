/**
 * Resolves a team member slug from author name, ID, or direct slug.
 * Handles both Arabic and English names gracefully.
 */
export function getAuthorSlug(nameOrId?: string, fallbackSlug?: string): string {
  if (fallbackSlug) return fallbackSlug;
  if (!nameOrId) return "sabri-alshaibani";

  const lower = nameOrId.toLowerCase().trim();

  // Common team members matching
  if (lower.includes("shaher") || lower.includes("شاهر")) {
    return "shaher-alward";
  }
  if (lower.includes("sabri") || lower.includes("صبري")) {
    return "sabri-alshaibani";
  }
  if (lower.includes("islam") || lower.includes("إسلام")) {
    return "islam-adel";
  }

  // Fallback slugify
  const clean = lower
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return clean || "sabri-alshaibani";
}
