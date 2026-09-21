import type { NavItem } from "./nav-types";
import { SUPPORTED_LOCALES } from "./nav-config";

/**
 * Normalizes a pathname by ensuring a leading slash and trimming trailing slashes.
 */
export function normalizePathname(pathname: string | undefined): string {
  if (!pathname || pathname === "") return "/";

  let normalized = pathname.trim();
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}

/**
 * Strips supported locale prefixes (e.g. /en, /ar) from the beginning of a pathname.
 *
 * Examples:
 * - "/en/services" -> "/services"
 * - "/ar/services/product-engineering" -> "/services/product-engineering"
 * - "/en" -> "/"
 * - "/services" -> "/services"
 */
export function stripLocalePrefix(
  pathname: string,
  locales: readonly string[] = SUPPORTED_LOCALES
): string {
  const normalized = normalizePathname(pathname);
  if (normalized === "/") return "/";

  for (const locale of locales) {
    if (normalized === `/${locale}`) {
      return "/";
    }
    if (normalized.startsWith(`/${locale}/`)) {
      return normalized.slice(locale.length + 1);
    }
  }

  return normalized;
}

/**
 * Evaluates whether a navigation item is active based on currentPath and item href.
 * Supports locale-prefixed routes and nested routes.
 *
 * Examples:
 * - currentPath: "/en/services", href: "/services" -> true
 * - currentPath: "/ar/services/product-engineering", href: "/services" -> true
 * - currentPath: "/en", href: "/" -> true
 * - currentPath: "/en/services", href: "/" -> false
 * - currentPath: "/projects", href: "/services" -> false
 */
export function isNavItemActive(
  currentPath: string | undefined,
  href: string,
  locales: readonly string[] = SUPPORTED_LOCALES
): boolean {
  if (!currentPath) return false;

  const normalizedCurrent = stripLocalePrefix(normalizePathname(currentPath), locales);
  const normalizedHref = stripLocalePrefix(normalizePathname(href), locales);

  if (normalizedHref === "/") {
    return normalizedCurrent === "/";
  }

  return (
    normalizedCurrent === normalizedHref ||
    normalizedCurrent.startsWith(`${normalizedHref}/`)
  );
}

/**
 * Evaluates whether a navigation item should be visible based on feature flags.
 */
export function isNavItemVisible(
  item: NavItem,
  showBlog = true,
  showCareers = true
): boolean {
  if (item.requiresFeatureFlag === "blog" && !showBlog) {
    return false;
  }
  if (item.requiresFeatureFlag === "careers" && !showCareers) {
    return false;
  }
  return true;
}

/**
 * Focusable element query selector for accessible modal dialogs.
 */
export const FOCUSABLE_ELEMENTS_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Retrieves all currently focusable and visible elements inside a container.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS_SELECTOR)
  ).filter((el) => el.offsetParent !== null || el.getClientRects().length > 0);
}
