"use client";

import * as React from "react";
import { usePathname, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  LuLayoutDashboard,
  LuFolderGit2,
  LuFileText,
  LuMessageSquare,
  LuUsers,
  LuSettings,
  LuGlobe,
  LuChevronLeft,
  LuChevronRight,
  LuShieldCheck,
  LuSparkles,
} from "react-icons/lu";

interface AdminSidebarProps {
  locale: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AdminSidebar({
  locale,
  isMobileOpen = false,
  onMobileClose,
}: AdminSidebarProps) {
  const t = useTranslations("Admin");
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const isRtl = locale === "ar";

  const navItems = [
    {
      title: t("nav.dashboard"),
      href: "/admin",
      icon: LuLayoutDashboard,
      exact: true,
    },
    {
      title: t("nav.projects"),
      href: "/admin/projects",
      icon: LuFolderGit2,
      badge: "0",
    },
    {
      title: t("nav.articles"),
      href: "/admin/articles",
      icon: LuFileText,
      badge: "0",
    },
    {
      title: t("nav.inquiries"),
      href: "/admin/inquiries",
      icon: LuMessageSquare,
      badge: "0",
    },
    {
      title: t("nav.users"),
      href: "/admin/users",
      icon: LuUsers,
    },
    {
      title: t("nav.settings"),
      href: "/admin/settings",
      icon: LuSettings,
    },
  ];

  const checkIsActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          role="presentation"
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 z-40 flex flex-col bg-card border-e border-border transition-all duration-300 select-none",
          // Desktop positioning
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          // Width based on collapsed state
          isCollapsed ? "w-18" : "w-64",
          // Mobile responsive slide-over
          isRtl
            ? isMobileOpen
              ? "right-0 translate-x-0"
              : "right-0 translate-x-full lg:translate-x-0"
            : isMobileOpen
            ? "left-0 translate-x-0"
            : "left-0 -translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand / Logo Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 overflow-hidden transition-all",
              isCollapsed && "justify-center w-full"
            )}
            title="Musnad Tech Admin"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <LuShieldCheck className="w-5 h-5 text-primary" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm tracking-tight text-foreground truncate">
                  Musnad Tech
                </span>
                <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                  <LuSparkles className="w-3 h-3 text-amber-500" />
                  {t("nav.roleBadge")}
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = checkIsActive(item.href, item.exact);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-transform duration-150 group-hover:scale-105",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />

                {!isCollapsed && (
                  <span className="truncate flex-1">{item.title}</span>
                )}

                {!isCollapsed && item.badge && (
                  <Badge
                    variant={isActive ? "secondary" : "outline"}
                    size="sm"
                    className="text-[10px] px-1.5 py-0 h-4.5 font-mono"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-border space-y-1.5 bg-muted/20">
          {/* Back to Live Website Link */}
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors",
              isCollapsed && "justify-center px-2"
            )}
            title={isCollapsed ? t("nav.viewSite") : undefined}
          >
            <LuGlobe className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="truncate">{t("nav.viewSite")}</span>}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-full items-center justify-center p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              isRtl ? (
                <LuChevronLeft className="w-4 h-4" />
              ) : (
                <LuChevronRight className="w-4 h-4" />
              )
            ) : isRtl ? (
              <LuChevronRight className="w-4 h-4" />
            ) : (
              <LuChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
