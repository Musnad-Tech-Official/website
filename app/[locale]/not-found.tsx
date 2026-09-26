import { NotFoundHero } from "@/components/not-found/not-found-hero";
import { SuggestedPages } from "@/components/not-found/suggested-pages";

/**
 * Localized 404 / Not Found Page for Musnad Tech.
 *
 * Renders within app/[locale]/layout.tsx with global Navbar, ThemeProvider,
 * and global Footer preserved.
 */
export default function NotFoundPage() {
  return (
    <div className="relative flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-20 overflow-hidden">
      {/* Subtle atmospheric ambient glow matching screenshot */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[520px] md:w-[680px] h-[260px] sm:h-[380px] bg-primary/4 dark:bg-primary/7 rounded-full blur-3xl -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 right-[10%] w-72 sm:w-96 h-72 sm:h-96 bg-primary/3 dark:bg-primary/5 rounded-full blur-3xl -z-10"
        aria-hidden="true"
      />

      <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
        <NotFoundHero />
        <SuggestedPages className="w-full mt-12 sm:mt-16 md:mt-20" />
      </div>
    </div>
  );
}
