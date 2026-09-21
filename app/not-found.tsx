import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-4 p-8 max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary mb-2 border border-primary/20">
          <span className="text-3xl font-extrabold tracking-tight">404</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Page Not Found
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-95 active:scale-[0.98] transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
