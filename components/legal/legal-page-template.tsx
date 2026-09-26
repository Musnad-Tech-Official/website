import React from "react";
import { LegalPageIntro } from "./legal-page-intro";
import { LegalToc } from "./legal-toc";
import { LegalSectionContent } from "./legal-section-content";
import { LegalContactCard } from "./legal-contact-card";
import type { LegalPageTemplateProps } from "./legal-types";
import { cn } from "@/lib/utils";

export function LegalPageTemplate({
  config,
  className = "",
}: LegalPageTemplateProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1 pb-16 sm:pb-24",
        className
      )}
    >
      {/* 1. Header / Intro & Breadcrumbs */}
      <LegalPageIntro
        breadcrumbHome={config.breadcrumbHome}
        breadcrumbLegal={config.breadcrumbLegal}
        breadcrumbCurrent={config.breadcrumbCurrent}
        breadcrumbLabel={config.breadcrumbLabel}
        eyebrow={config.eyebrow}
        title={config.title}
        lastUpdatedLabel={config.lastUpdatedLabel}
        lastUpdatedDate={config.lastUpdatedDate}
        introNote={config.introNote}
      />

      {/* 2. Main Two-Column Layout (TOC & Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mt-10 sm:mt-14">
        {/* Left Column: Table of Contents */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24">
          <LegalToc
            sections={config.sections}
            onThisPageLabel={config.onThisPageLabel}
          />
        </aside>

        {/* Right Column: Legal Content & Contact CTA */}
        <main className="lg:col-span-8 space-y-12 sm:space-y-16">
          <div className="space-y-12 sm:space-y-16">
            {config.sections.map((section) => (
              <LegalSectionContent key={section.id} section={section} />
            ))}
          </div>

          <LegalContactCard config={config.contactCard} />
        </main>
      </div>
    </div>
  );
}
