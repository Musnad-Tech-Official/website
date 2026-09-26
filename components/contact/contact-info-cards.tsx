import * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  LuMail,
  LuMapPin,
  LuCircleCheck,
} from "react-icons/lu";
import { OFFICIAL_SOCIAL_LINKS } from "@/components/footer/footer-config";
import type { ContactInfoCardsProps } from "./contact-types";

/**
 * ContactInfoCards renders the sidebar information for Page 28 (Contact):
 * - "Other ways to reach us" (Email, Address, SLA commitment, Verified social channels)
 *
 * CONTENT & DESIGN INTEGRITY:
 * 1. Only approved factual values (email, location, official SLA, verified social profiles)
 *    are rendered. Fictitious phone numbers, office addresses, or unverified workflow
 *    claims are strictly omitted.
 * 2. All styling adheres to repository semantic design tokens (bg-card, bg-muted, border-border,
 *    text-foreground, text-primary, text-muted-foreground) without direct Tailwind palette colors.
 */
export function ContactInfoCards({
  contactInfo,
  className,
}: ContactInfoCardsProps) {
  const t = useTranslations("Contact.sidebar");

  // Filter verified primary social channels (matching the 3 channels in the reference layout)
  const primarySocialChannels = OFFICIAL_SOCIAL_LINKS.filter((social) =>
    ["x", "linkedin", "github"].includes(social.id)
  );

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Card: Other ways to reach us */}
      <Card
        variant="default"
        className="rounded-2xl p-6 sm:p-8 bg-card border-border shadow-xs space-y-6"
      >
        <h2 className="text-xl font-bold tracking-tight text-foreground font-display">
          {t("otherWaysTitle")}
        </h2>

        {/* Contact Methods List */}
        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground border border-border/50">
              <LuMail className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="space-y-0.5">
              <span className="block text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                {t("emailLabel")}
              </span>
              <a
                href={contactInfo.emailHref}
                dir="ltr"
                className="inline-block text-sm font-medium text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-xs"
              >
                {contactInfo.email}
              </a>
            </div>
          </div>

          {/* Address / Location */}
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground border border-border/50">
              <LuMapPin className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="space-y-0.5">
              <span className="block text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                {t("addressLabel")}
              </span>
              <span className="block text-sm font-medium text-foreground">
                {contactInfo.location}
              </span>
            </div>
          </div>
        </div>

        {/* SLA Commitment Highlight Card (Using repository semantic tokens) */}
        <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4 transition-colors">
          <LuCircleCheck
            className="h-5 w-5 text-primary shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-foreground">
              {contactInfo.responseCommitment}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {contactInfo.responseDescription}
            </p>
          </div>
        </div>

        {/* Official Channels Row */}
        <div className="pt-1">
          <span className="sr-only">{t("socialTitle")}</span>
          <div
            className="flex items-center gap-2.5"
            aria-label={t("socialTitle")}
          >
            {primarySocialChannels.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-150",
                    "hover:bg-muted hover:text-foreground hover:border-foreground/30 active:scale-95",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{social.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
