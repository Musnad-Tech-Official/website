"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LuQuote, LuCopy, LuCheck } from "react-icons/lu";
import type { ArticleCitationProps } from "./article-detail-types";
import { cn } from "@/lib/utils";

export function ArticleCitation({
  citation,
  className = "",
}: ArticleCitationProps) {
  const t = useTranslations("ArticleDetail.sidebar");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("apa");

  // Reusable architecture: renders nothing when citation metadata is absent
  if (!citation) {
    return null;
  }

  const getCurrentText = () => {
    switch (activeTab) {
      case "mla":
        return citation.mla;
      case "chicago":
        return citation.chicago;
      case "bibtex":
        return citation.bibtex;
      case "apa":
      default:
        return citation.apa;
    }
  };

  const handleCopy = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(getCurrentText());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-5 shadow-2xs space-y-4",
        className
      )}
    >
      {/* Title */}
      <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase select-none pb-2 border-b border-border/40">
        <LuQuote className="h-4 w-4 text-primary" aria-hidden="true" />
        <span>{t("cite")}</span>
      </div>

      {/* Citation Tabs */}
      <Tabs
        defaultValue="apa"
        value={activeTab}
        onValueChange={setActiveTab}
        variant="pill"
        className="space-y-3"
      >
        <TabsList className="w-full grid grid-cols-4 h-8 p-1">
          <TabsTrigger value="apa" className="text-xs py-1">
            APA
          </TabsTrigger>
          <TabsTrigger value="mla" className="text-xs py-1">
            MLA
          </TabsTrigger>
          <TabsTrigger value="chicago" className="text-xs py-1">
            Chicago
          </TabsTrigger>
          <TabsTrigger value="bibtex" className="text-xs py-1">
            BibTeX
          </TabsTrigger>
        </TabsList>

        <TabsContent value="apa">
          <div className="p-3 rounded-xl bg-muted/60 border border-border/60 text-xs font-mono text-muted-foreground leading-relaxed break-words max-h-28 overflow-y-auto">
            {citation.apa}
          </div>
        </TabsContent>

        <TabsContent value="mla">
          <div className="p-3 rounded-xl bg-muted/60 border border-border/60 text-xs font-mono text-muted-foreground leading-relaxed break-words max-h-28 overflow-y-auto">
            {citation.mla}
          </div>
        </TabsContent>

        <TabsContent value="chicago">
          <div className="p-3 rounded-xl bg-muted/60 border border-border/60 text-xs font-mono text-muted-foreground leading-relaxed break-words max-h-28 overflow-y-auto">
            {citation.chicago}
          </div>
        </TabsContent>

        <TabsContent value="bibtex">
          <pre className="p-3 rounded-xl bg-muted/60 border border-border/60 text-[11px] font-mono text-muted-foreground leading-relaxed whitespace-pre-wrap max-h-28 overflow-y-auto">
            {citation.bibtex}
          </pre>
        </TabsContent>
      </Tabs>

      {/* Copy Citation Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCopy}
        aria-label={copied ? t("citationCopied") : t("copyCitation")}
        className="w-full rounded-xl text-xs font-medium gap-1.5"
      >
        {copied ? (
          <>
            <LuCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span className="text-primary font-semibold">
              {t("citationCopied")}
            </span>
          </>
        ) : (
          <>
            <LuCopy className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            <span>{t("copyCitation")}</span>
          </>
        )}
      </Button>
    </div>
  );
}
