import * as React from "react";
import { getTranslations } from "next-intl/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LuSettings, LuDatabase, LuKey } from "react-icons/lu";

interface AdminSettingsProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminSettingsPage({ params }: AdminSettingsProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <LuSettings className="w-6 h-6 text-primary" />
            {t("nav.settings")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            System configuration, environment telemetry, and operational status.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <LuDatabase className="w-4 h-4 text-emerald-500" />
                Database Configuration
              </CardTitle>
              <Badge variant="success" size="sm">Active</Badge>
            </div>
            <CardDescription className="text-xs">
              Supabase PostgreSQL Database connection status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">Provider:</span>
              <span className="font-semibold text-foreground">Supabase</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">Row Level Security:</span>
              <span className="font-semibold text-emerald-500">Enabled</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">Preserved Profiles:</span>
              <span className="font-semibold text-foreground">4 Active Rows</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <LuKey className="w-4 h-4 text-purple-500" />
                Authentication & JWT
              </CardTitle>
              <Badge variant="success" size="sm">Active</Badge>
            </div>
            <CardDescription className="text-xs">
              Clerk Identity & Custom Session Claims
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">Auth Provider:</span>
              <span className="font-semibold text-foreground">Clerk</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">Claim Template:</span>
              <span className="font-semibold font-mono text-primary text-[11px]">metadata.role</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">Edge Guard:</span>
              <span className="font-semibold text-emerald-500">Enforced in proxy.ts</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
