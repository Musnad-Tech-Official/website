"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  LuLayoutDashboard,
  LuFolderGit2,
  LuFileText,
  LuMessageSquare,
  LuMessagesSquare,
  LuUsers,
  LuSettings,
  LuGlobe,
  LuChevronLeft,
  LuChevronRight,
  LuX,
} from "react-icons/lu";

interface AdminSidebarProps {
  locale: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AdminSidebar({
  locale,
  isMobileOpen = false,
  onMobileClose,
  isCollapsed: propIsCollapsed,
  onToggleCollapse,
}: AdminSidebarProps) {
  const t = useTranslations("Admin");
  const pathname = usePathname();
  const [localCollapsed, setLocalCollapsed] = React.useState(false);
  const isCollapsed = propIsCollapsed ?? localCollapsed;
  const toggleCollapse = onToggleCollapse ?? (() => setLocalCollapsed(!localCollapsed));

  const isRtl = locale === "ar";

  const navItems = [
    {
      title: t("nav.dashboard"),
      href: "/admin",
      icon: LuLayoutDashboard,
      exact: true,
    },
    {
      title: t("nav.pages"),
      href: "/admin/pages",
      icon: LuGlobe,
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
      title: t("nav.comments"),
      href: "/admin/comments",
      icon: LuMessagesSquare,
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

      {/* Sidebar Shell - Fixed to viewport */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 start-0 z-40 flex flex-col bg-card border-e border-border transition-all duration-300 select-none h-screen",
          // Width based on collapsed state
          isCollapsed ? "w-18" : "w-64",
          // Mobile responsive slide-over & desktop fixed positioning
          isRtl
            ? isMobileOpen
              ? "translate-x-0"
              : "translate-x-full lg:translate-x-0"
            : isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand / Logo Header */}
        <div
          className={cn(
            "flex items-center h-16 border-b border-border transition-all duration-300",
            isCollapsed ? "justify-center px-2" : "justify-between px-4"
          )}
        >
          {/* Real Brand Logo (shown only when NOT collapsed) */}
          {!isCollapsed && (
            <Link
              href="/admin"
              className="flex items-center gap-2 overflow-hidden transition-all select-none min-w-0"
              title="Musnad Tech Admin"
            >
              {/* Light Mode Logo */}
              <Image
                src="/brand/logo-light.png"
                alt="Musnad Tech Logo"
                width={1024}
                height={341}
                priority
                className="h-7 w-auto object-contain dark:hidden"
              />
              {/* Dark Mode Logo */}
              <Image
                src="/brand/logo-dark.png"
                alt="Musnad Tech Logo"
                width={1024}
                height={341}
                priority
                className="h-7 w-auto object-contain hidden dark:block"
              />
            </Link>
          )}

          {/* Desktop Collapse Toggle Button (Top next to logo when expanded, centered alone when collapsed) */}
          <button
            type="button"
            onClick={toggleCollapse}
            className={cn(
              "hidden lg:flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer shrink-0",
              isCollapsed ? "w-9 h-9" : "w-8 h-8"
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              isRtl ? (
                <LuChevronLeft className="w-5 h-5" />
              ) : (
                <LuChevronRight className="w-5 h-5" />
              )
            ) : isRtl ? (
              <LuChevronRight className="w-5 h-5" />
            ) : (
              <LuChevronLeft className="w-5 h-5" />
            )}
          </button>

          {/* Mobile Close Button */}
          {onMobileClose && (
            <button
              type="button"
              onClick={onMobileClose}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Close sidebar"
              aria-label="Close sidebar"
            >
              <LuX className="w-4 h-4" />
            </button>
          )}
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
        </div>
      </aside>
    </>
  );
}
