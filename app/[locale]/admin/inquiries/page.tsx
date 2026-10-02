import * as React from "react";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { LuMessageSquare, LuSearch } from "react-icons/lu";

interface AdminInquiriesProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminInquiriesPage({ params }: AdminInquiriesProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <LuMessageSquare className="w-6 h-6 text-primary" />
            {t("nav.inquiries")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Client inquiries, contact submissions, and service requests.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <LuSearch className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search inquiries by client name or email..."
              className="w-full h-9 ps-9 pe-4 bg-muted/40 border border-border/80 rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </CardContent>
      </Card>

      <EmptyState
        icon={<LuMessageSquare className="w-6 h-6 text-muted-foreground" />}
        title="Inbox is clear"
        description="No pending inquiries or client messages in the database queue."
      />
    </div>
  );
}
