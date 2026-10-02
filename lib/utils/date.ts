/**
 * Formats an ISO date string or timestamp into a readable localized format.
 *
 * Examples:
 * - en: 'October 2, 2026'
 * - ar: '2 أكتوبر 2026'
 */
export function formatArticleDate(
  dateString?: string | null,
  locale: string = "en"
): string {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat(locale === "ar" ? "ar-u-nu-latn" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}
