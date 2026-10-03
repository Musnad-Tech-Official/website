"use client";

import * as React from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  children: React.ReactNode;
  locale: string;
}

export function AdminShell({ children, locale }: AdminShellProps) {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">
      {/* Sidebar - Fixed to viewport */}
      <AdminSidebar
        locale={locale}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main View Area - Pushed by the fixed sidebar width on desktop */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          isCollapsed ? "lg:ms-18" : "lg:ms-64"
        )}
      >
        <AdminHeader
          locale={locale}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
        />
        <main className="flex-1 p-3.5 sm:p-5 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
