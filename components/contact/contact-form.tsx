"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  LuSend,
  LuSparkles,
  LuPaperclip,
  LuFileCheck,
  LuTrash2,
  LuInfo,
} from "react-icons/lu";
import type { ContactFormProps } from "./contact-types";

/**
 * ContactForm renders the full contact submission form matching the Page 28 structural reference.
 *
 * FRONTEND-ONLY ARCHITECTURE NOTE:
 * In compliance with project guidelines, this component provides a realistic, accessible
 * client form experience without backend mutations or fake submission success.
 * - Users can enter details and upload attachments locally in temporary client state.
 * - Submission remains safely disabled with an explicit localized integration notice banner.
 * - The privacy notice uses non-linked text because no dedicated /privacy route exists yet.
 */
export function ContactForm({ className }: ContactFormProps) {
  const t = useTranslations("Contact.form");

  // Form State (temporary client component state only)
  const [inquiryType, setInquiryType] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [company, setCompany] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");
  const [projectType, setProjectType] = React.useState<string>("");
  const [budget, setBudget] = React.useState<string>("");
  const [timeline, setTimeline] = React.useState<string>("");
  const [currentProduct, setCurrentProduct] = React.useState<string>("");
  const [attachment, setAttachment] = React.useState<File | null>(null);
  const [message, setMessage] = React.useState<string>("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 10MB limit guard (client-side only, no upload/persistence)
      if (file.size <= 10 * 1024 * 1024) {
        setAttachment(file);
      }
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card
      variant="default"
      className={cn(
        "rounded-2xl p-6 sm:p-8 md:p-10 bg-card border-border shadow-xs",
        className
      )}
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        noValidate
        className="space-y-6"
        aria-label={t("inquiryType.label")}
      >
        {/* Inquiry Type */}
        <div>
          <Select
            id="inquiry-type"
            label={t("inquiryType.label")}
            value={inquiryType}
            onChange={(e) => setInquiryType(e.target.value)}
          >
            <option value="" disabled>
              {t("inquiryType.placeholder")}
            </option>
            <option value="project">{t("inquiryType.options.project")}</option>
            <option value="general">{t("inquiryType.options.general")}</option>
            <option value="partnership">{t("inquiryType.options.partnership")}</option>
            <option value="careers">{t("inquiryType.options.careers")}</option>
          </Select>
        </div>

        {/* Row: Name & Email */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="contact-name"
            label={t("name.label")}
            placeholder={t("name.placeholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />

          <Input
            id="contact-email"
            type="email"
            label={t("email.label")}
            placeholder={t("email.placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            dir="ltr"
            className="text-start"
            autoComplete="email"
          />
        </div>

        {/* Row: Company & Phone */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="contact-company"
            label={t("company.label")}
            placeholder={t("company.placeholder")}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            autoComplete="organization"
          />

          <Input
            id="contact-phone"
            type="tel"
            label={t("phone.label")}
            placeholder={t("phone.placeholder")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            dir="ltr"
            className="text-start"
            autoComplete="tel"
          />
        </div>

        {/* Project Details Nested Card */}
        <div className="rounded-xl border border-border/80 bg-muted/20 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm sm:text-base">
            <LuSparkles className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
            <span>{t("projectDetails.title")}</span>
          </div>

          {/* Sub-grid 1: Project Type & Budget */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              id="project-type"
              label={t("projectDetails.projectType.label")}
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
            >
              <option value="">{t("projectDetails.projectType.placeholder")}</option>
              <option value="web">{t("projectDetails.projectType.options.web")}</option>
              <option value="mobile">{t("projectDetails.projectType.options.mobile")}</option>
              <option value="enterprise">{t("projectDetails.projectType.options.enterprise")}</option>
              <option value="ai">{t("projectDetails.projectType.options.ai")}</option>
              <option value="design">{t("projectDetails.projectType.options.design")}</option>
              <option value="tools">{t("projectDetails.projectType.options.tools")}</option>
            </Select>

            <Select
              id="project-budget"
              label={t("projectDetails.budget.label")}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            >
              <option value="">{t("projectDetails.budget.placeholder")}</option>
              <option value="tier1">{t("projectDetails.budget.options.tier1")}</option>
              <option value="tier2">{t("projectDetails.budget.options.tier2")}</option>
              <option value="tier3">{t("projectDetails.budget.options.tier3")}</option>
              <option value="tier4">{t("projectDetails.budget.options.tier4")}</option>
              <option value="undisclosed">{t("projectDetails.budget.options.undisclosed")}</option>
            </Select>
          </div>

          {/* Sub-grid 2: Timeline & Current Website */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              id="project-timeline"
              label={t("projectDetails.timeline.label")}
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
            >
              <option value="">{t("projectDetails.timeline.placeholder")}</option>
              <option value="urgent">{t("projectDetails.timeline.options.urgent")}</option>
              <option value="standard">{t("projectDetails.timeline.options.standard")}</option>
              <option value="extended">{t("projectDetails.timeline.options.extended")}</option>
              <option value="flexible">{t("projectDetails.timeline.options.flexible")}</option>
            </Select>

            <Input
              id="project-product"
              label={t("projectDetails.currentProduct.label")}
              placeholder={t("projectDetails.currentProduct.placeholder")}
              value={currentProduct}
              onChange={(e) => setCurrentProduct(e.target.value)}
              dir="ltr"
              className="text-start"
            />
          </div>

          {/* Attachment Upload Dropzone */}
          <div className="space-y-1.5 pt-1">
            <span className="block text-sm font-medium text-foreground">
              {t("projectDetails.attachment.label")}
            </span>

            <input
              ref={fileInputRef}
              type="file"
              id="project-attachment"
              accept=".pdf,.doc,.docx,.zip"
              className="sr-only"
              onChange={handleFileChange}
            />

            {!attachment ? (
              <label
                htmlFor="project-attachment"
                className={cn(
                  "flex items-center justify-center gap-2.5 rounded-xl border border-dashed border-border/80 bg-background/50 p-4 text-center cursor-pointer transition-all duration-150",
                  "hover:border-primary/50 hover:bg-muted/30 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                )}
              >
                <LuPaperclip className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
                <span className="text-xs sm:text-sm text-muted-foreground font-normal">
                  {t("projectDetails.attachment.hint")}
                </span>
              </label>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-border bg-background p-3.5 transition-all">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <LuFileCheck className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                  <span className="text-xs sm:text-sm text-foreground font-medium truncate">
                    {attachment.name}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0 font-mono">
                    ({formatFileSize(attachment.size)})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  aria-label={t("projectDetails.attachment.remove")}
                  className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <LuTrash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Message Textarea */}
        <div>
          <Textarea
            id="contact-message"
            label={t("message.label")}
            placeholder={t("message.placeholder")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
          />
        </div>

        {/* Clear Localized Integration Notice */}
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4 text-xs sm:text-sm text-muted-foreground leading-relaxed"
        >
          <LuInfo className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <span>{t("integrationNotice")}</span>
        </div>

        {/* Submit Action & Privacy Note (Non-linked text because /privacy route does not exist) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
          <Button
            type="button"
            variant="primary"
            size="lg"
            disabled
            aria-disabled="true"
            title={t("integrationNotice")}
            leftIcon={<LuSend className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />}
            className="w-full sm:w-auto"
          >
            {t("submit")}
          </Button>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("privacyNotice.prefix")}{" "}
            <span className="font-medium text-foreground">
              {t("privacyNotice.privacyLink")}
            </span>
            {t("privacyNotice.suffix")}
          </p>
        </div>
      </form>
    </Card>
  );
}
