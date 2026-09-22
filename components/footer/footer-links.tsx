import { Link } from "@/i18n/routing";
import type { FooterLinksProps } from "./footer-types";
import { cn } from "@/lib/utils";

/**
 * FooterLinks renders a navigation column with:
 * - Semantic <nav> element with accessible aria-label
 * - Heading for section title
 * - Vertical list of localized links with comfortable touch targets and visible focus indicators
 */
export function FooterLinks({ section, className = "" }: FooterLinksProps) {
  return (
    <nav
      aria-label={section.title}
      className={cn("flex flex-col text-start", className)}
    >
      <h3 className="text-sm font-semibold tracking-wider text-foreground">
        {section.title}
      </h3>

      <ul role="list" className="mt-4 flex flex-col gap-2.5 list-none m-0 p-0">
        {section.links.map((link) => {
          const isExternal = link.external || link.href.startsWith("http");

          return (
            <li key={link.id}>
              {isExternal ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center text-sm text-muted-foreground transition-colors duration-150",
                    "hover:text-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
                  )}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className={cn(
                    "inline-flex items-center text-sm text-muted-foreground transition-colors duration-150",
                    "hover:text-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
                  )}
                >
                  {link.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
