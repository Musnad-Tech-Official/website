"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { LuCopy, LuCheck, LuCode } from "react-icons/lu";

export interface ArticleCodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

/**
 * ArticleCodeBlock provides a developer-grade code presentation experience:
 * - Always forces LTR layout for code integrity
 * - Subtle terminal window affordance (matching Stripe / Vercel docs)
 * - Line numbering for technical review
 * - 1-click clipboard copy with stateful feedback
 */
export function ArticleCodeBlock({
  code,
  language,
  filename,
  showLineNumbers = true,
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

  const lines = code.trim().split("\n");

  return (
    <div
      dir="ltr"
      className={`my-8 rounded-2xl border border-zinc-800 bg-[#0d0e12] text-zinc-100 overflow-hidden shadow-md ${className}`}
    >
      {/* Developer Terminal Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#15161c] border-b border-zinc-800/80 text-xs text-zinc-400 font-mono select-none">
        <div className="flex items-center gap-3 min-w-0">
          {/* Subtle Window Control Dots */}
          <div aria-hidden="true" className="flex items-center gap-1.5 shrink-0">
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-700/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-700/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-700/80" />
          </div>

          <div className="flex items-center gap-2 truncate">
            <LuCode className="h-3.5 w-3.5 text-zinc-400 shrink-0" aria-hidden="true" />
            {filename ? (
              <span className="font-semibold text-zinc-200 truncate">{filename}</span>
            ) : language ? (
              <span className="text-zinc-400 truncate">{language}</span>
            ) : null}
            {language && filename && (
              <span className="uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                {language}
              </span>
            )}
          </div>
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

      {/* Code Area with optional Line Numbers */}
      <div className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-[13px] font-mono leading-relaxed text-zinc-200">
        {showLineNumbers && lines.length > 1 ? (
          <div className="grid grid-cols-[auto_1fr] gap-4">
            <div
              aria-hidden="true"
              className="text-right text-zinc-600 select-none font-mono"
            >
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <pre className="overflow-x-auto m-0 p-0 font-mono">
              <code>
                {lines.map((line, i) => (
                  <div key={i}>{line || " "}</div>
                ))}
              </code>
            </pre>
          </div>
        ) : (
          <pre className="overflow-x-auto m-0 p-0 font-mono">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
