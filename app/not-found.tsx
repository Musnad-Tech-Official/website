import Link from "next/link";
import { LuArrowLeft, LuSearch, LuCompass } from "react-icons/lu";

/**
 * Root fallback 404 page for unmatched routes outside locale scope.
 */
export default function RootNotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 bg-background text-foreground relative overflow-hidden">
      {/* Subtle atmospheric ambient glow */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[260px] sm:h-[350px] bg-primary/5 rounded-full blur-3xl -z-10"
        aria-hidden="true"
      />

      <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center">
        {/* Decorative circular marker */}
        <div
          className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border/80 bg-card/60 backdrop-blur-xs text-muted-foreground shadow-xs mb-3 sm:mb-4 select-none"
          aria-hidden="true"
        >
          <LuCompass className="w-5 h-5 text-muted-foreground/80" />
        </div>

        {/* 404 Display */}
        <div className="relative select-none leading-none">
          <span
            className="font-serif text-[100px] sm:text-[145px] md:text-[180px] font-normal leading-none tracking-tight text-foreground/90 select-none"
            aria-hidden="true"
          >
            404
          </span>
        </div>

        {/* Heading */}
        <h1 className="mt-2 sm:mt-4 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance">
          Page not found
        </h1>

        {/* Description */}
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed text-balance">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>

        {/* Recovery Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center select-none cursor-pointer h-11 px-6 rounded-xl font-medium text-sm gap-2.5 bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98] shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LuArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Back to home</span>
          </Link>

          <Link
            href="/en/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center select-none cursor-pointer h-11 px-5 rounded-xl font-medium text-sm gap-2.5 bg-card hover:bg-secondary/70 text-foreground border border-border/80 active:scale-[0.98] shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LuSearch className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
            <span>Search for a page</span>
            <kbd className="inline-flex items-center justify-center text-[10px] font-mono font-medium tracking-tight text-muted-foreground/80 bg-secondary/80 px-1.5 py-0.5 rounded border border-border/60 select-none ms-1">
              ⌘K
            </kbd>
          </Link>
        </div>
      </div>
    </div>
  );
}
