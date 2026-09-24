"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { LuCopy, LuCheck, LuCode } from "react-icons/lu";

interface ArticleCodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function ArticleCodeBlock({
  code,
  language,
  filename,
  className = "",
}: ArticleCodeBlockProps) {
  const t = useTranslations("ArticleDetail.code");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className={`my-8 rounded-2xl border border-border/80 bg-zinc-950 text-zinc-100 overflow-hidden shadow-xs dark:border-border/60 ${className}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 text-xs text-zinc-400 font-mono">
        <div className="flex items-center gap-2 truncate">
          <LuCode className="h-3.5 w-3.5 text-zinc-400 shrink-0" aria-hidden="true" />
          {filename && <span className="font-semibold text-zinc-200 truncate">{filename}</span>}
          {language && (
            <span className="uppercase tracking-wider text-[11px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">
              {language}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? t("copied") : t("copy")}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {copied ? (
            <>
              <LuCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
              <span className="text-emerald-400 font-medium">{t("copied")}</span>
            </>
          ) : (
            <>
              <LuCopy className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t("copy")}</span>
            </>
          )}
        </button>
      </div>

      {/* Code contents */}
      <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-zinc-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}
