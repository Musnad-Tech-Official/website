"use client";

import * as React from "react";
import { usePathname, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { UserButton } from "@clerk/nextjs";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  LuMenu,
  LuSearch,
  LuChevronRight,
  LuChevronLeft,
  LuBell,
  LuPlus,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  locale: string;
  onOpenMobileMenu: () => void;
}

export function AdminHeader({ locale, onOpenMobileMenu }: AdminHeaderProps) {
  const t = useTranslations("Admin");
  const pathname = usePathname();
  const isRtl = locale === "ar";
  const Chevron = isRtl ? LuChevronLeft : LuChevronRight;

  // Format breadcrumbs from pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  // pathSegments might be ['admin', 'projects', ...]
  const currentSegment = pathSegments[pathSegments.length - 1];
  const pageTitle =
    currentSegment === "admin"
      ? t("nav.dashboard")
      : t.has(`nav.${currentSegment}`)
      ? t(`nav.${currentSegment}`)
      : currentSegment;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-card/85 backdrop-blur-md border-b border-border transition-all">
      {/* Left: Mobile Menu & Dynamic Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="p-2 -ms-1 text-muted-foreground hover:text-foreground rounded-lg lg:hidden hover:bg-muted focus:outline-hidden"
          aria-label="Open navigation menu"
        >
          <LuMenu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="hidden sm:flex items-center gap-2 text-sm"
        >
          <Link
            href="/admin"
            className="text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            Musnad
          </Link>
          <Chevron className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
          <span className="font-semibold text-foreground capitalize">
            {pageTitle}
          </span>
        </nav>
      </div>

      {/* Center: Command Palette Trigger / Search bar */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <LuSearch className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            readOnly
            placeholder={t("header.searchPlaceholder")}
            className="w-full h-9 ps-9 pe-12 bg-muted/50 hover:bg-muted/80 focus:bg-background border border-border/70 rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer"
            onClick={() => {
              // Can trigger Command palette dialog
            }}
          />
          <div className="absolute end-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-background border border-border rounded shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Actions, Notifications, Utilities & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick New Button */}
        <Button
          variant="primary"
          size="sm"
          className="hidden sm:inline-flex items-center gap-1.5 h-8 text-xs font-medium"
        >
          <LuPlus className="w-3.5 h-3.5" />
          <span>{t("header.newAction")}</span>
        </Button>

        {/* Notifications Icon Button */}
        <button
          type="button"
          className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors focus:outline-hidden"
          title={t("header.notifications")}
          aria-label={t("header.notifications")}
        >
          <LuBell className="w-4 h-4" />
          <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-card" />
        </button>

        {/* Utilities: Language & Theme */}
        <div className="h-5 w-px bg-border mx-0.5" />
        <LanguageSwitcher variant="toggle" size="sm" />
        <ThemeSwitcher variant="icon" size="sm" />
        <div className="h-5 w-px bg-border mx-0.5" />

        {/* Clerk User Profile */}
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8 rounded-lg ring-1 ring-border shadow-xs",
            },
          }}
        />
      </div>
    </header>
  );
}
