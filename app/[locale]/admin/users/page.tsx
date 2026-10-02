import * as React from "react";
import { getTranslations } from "next-intl/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LuUsers, LuShieldCheck, LuUserCheck } from "react-icons/lu";

interface AdminUsersProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminUsersPage({ params }: AdminUsersProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <LuUsers className="w-6 h-6 text-primary" />
            {t("nav.users")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage system access, team members, and Clerk role assignments.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">
                Registered Profiles & Roles
              </CardTitle>
              <CardDescription className="text-xs">
                Connected to public.profiles table (4 preserved user records)
              </CardDescription>
            </div>
            <Badge variant="accent" size="sm" className="font-mono gap-1">
              <LuShieldCheck className="w-3.5 h-3.5" />
              RLS Enforced
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-muted/30 border border-border/60 text-xs text-muted-foreground flex items-center gap-3">
            <LuUserCheck className="w-5 h-5 text-primary shrink-0" />
            <span>
              All administrative and team roles are managed through Clerk Public Metadata and verified on each request via custom session claims.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
