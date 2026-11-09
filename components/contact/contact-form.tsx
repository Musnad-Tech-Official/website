"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { submitInquiryAction } from "@/lib/inquiries/actions";
import {
  LuSend,
  LuCircleCheck,
  LuLoader,
  LuTriangleAlert,
} from "react-icons/lu";
import type { ContactFormProps } from "./contact-types";

/**
 * ContactForm renders the full contact submission form matching the Page 28 structural reference,
 * now connected to the real inquiries engine and admin lead queue.
 */
export function ContactForm({ className }: ContactFormProps) {
  const t = useTranslations("Contact.form");

  // Form State
  const [inquiryType, setInquiryType] = React.useState<string>("project");
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [company, setCompany] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");
  const [projectType, setProjectType] = React.useState<string>("");
  const [budget, setBudget] = React.useState<string>("");
  const [timeline, setTimeline] = React.useState<string>("");
  const [currentProduct, setCurrentProduct] = React.useState<string>("");
  const [message, setMessage] = React.useState<string>("");

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submissionSuccess, setSubmissionSuccess] = React.useState<{ inquiryId: string } | null>(null);
  const [errorAlert, setErrorAlert] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorAlert("Please enter your name, email address, and message.");
      return;
    }

    setIsSubmitting(true);
    setErrorAlert(null);

    const res = await submitInquiryAction({
      name,
      email,
      company,
      phone,
      inquiryType: inquiryType || "project",
      projectType,
      budget,
      timeline,
      currentProduct,
      message,
    });

    setIsSubmitting(false);

    if (res.success && res.inquiryId) {
      setSubmissionSuccess({ inquiryId: res.inquiryId });
    } else {
      setErrorAlert(res.error || "An error occurred while submitting your inquiry.");
    }
  };

  const handleResetForm = () => {
    setSubmissionSuccess(null);
    setName("");
    setEmail("");
    setCompany("");
    setPhone("");
    setProjectType("");
    setBudget("");
    setTimeline("");
    setCurrentProduct("");
    setMessage("");
    setErrorAlert(null);
  };

  if (submissionSuccess) {
    return (
      <Card
        variant="default"
        className={cn(
          "rounded-2xl p-8 sm:p-12 text-center bg-card border-border shadow-xs animate-in fade-in zoom-in-95 duration-300",
          className
        )}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto mb-5 shadow-xs">
          <LuCircleCheck className="h-8 w-8" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
          {t("submit")} — {name || "Success"}
        </h3>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted font-mono text-xs text-muted-foreground my-3">
          <span>Ref ID:</span>
          <span className="font-bold text-foreground">#{submissionSuccess.inquiryId}</span>
        </div>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed mt-2 mb-8">
          We have received your project inquiry and forwarded it directly to our technical architecture lead. Our team reviews all submissions and will follow up with you within two business days.
        </p>
        <Button onClick={handleResetForm} variant="outline" size="sm">
          Send another inquiry
        </Button>
      </Card>
    );
  }

  return (
    <Card
      variant="default"
      className={cn(
        "rounded-2xl p-6 sm:p-8 md:p-10 bg-card border-border shadow-xs",
        className
      )}
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6"
        aria-label={t("inquiryType.label")}
      >
        {errorAlert && (
          <Alert variant="destructive" className="py-3">
            <LuTriangleAlert className="h-4 w-4" />
            <AlertDescription className="text-xs">{errorAlert}</AlertDescription>
          </Alert>
        )}

        {/* Inquiry Type */}
        <div>
          <Select
            id="inquiry-type"
            label={t("inquiryType.label")}
            value={inquiryType}
            onChange={(e) => setInquiryType(e.target.value)}
            required
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

        {/* Contact Info (2 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            autoComplete="email"
          />
        </div>

        {/* Company and Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            autoComplete="tel"
          />
        </div>

        {/* Project Details (only for project inquiry or general) */}
        {inquiryType !== "careers" && (
          <div className="space-y-6 pt-2 border-t border-border/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Select
                id="contact-project-type"
                label={t("projectType.label")}
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
              >
                <option value="" disabled>
                  {t("projectType.placeholder")}
                </option>
                <option value="productEngineering">{t("projectType.options.productEngineering")}</option>
                <option value="platformInfrastructure">{t("projectType.options.platformInfrastructure")}</option>
                <option value="dataEngineering">{t("projectType.options.dataEngineering")}</option>
                <option value="developerTools">{t("projectType.options.developerTools")}</option>
                <option value="aiIntegration">{t("projectType.options.aiIntegration")}</option>
                <option value="designEngineering">{t("projectType.options.designEngineering")}</option>
              </Select>

              <Select
                id="contact-budget"
                label={t("budget.label")}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              >
                <option value="" disabled>
                  {t("budget.placeholder")}
                </option>
                <option value="under25k">{t("budget.options.under25k")}</option>
                <option value="25k-50k">{t("budget.options.25k-50k")}</option>
                <option value="50k-100k">{t("budget.options.50k-100k")}</option>
                <option value="over100k">{t("budget.options.over100k")}</option>
                <option value="undisclosed">{t("budget.options.undisclosed")}</option>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Select
                id="contact-timeline"
                label={t("timeline.label")}
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
              >
                <option value="" disabled>
                  {t("timeline.placeholder")}
                </option>
                <option value="immediate">{t("timeline.options.immediate")}</option>
                <option value="oneToThreeMonths">{t("timeline.options.oneToThreeMonths")}</option>
                <option value="threeToSixMonths">{t("timeline.options.threeToSixMonths")}</option>
                <option value="flexible">{t("timeline.options.flexible")}</option>
              </Select>

              <Input
                id="contact-current-product"
                label={t("currentProduct.label")}
                placeholder={t("currentProduct.placeholder")}
                value={currentProduct}
                onChange={(e) => setCurrentProduct(e.target.value)}
              />
            </div>
          </div>
        )}

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

        {/* Submit Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            leftIcon={
              isSubmitting ? (
                <LuLoader className="h-4 w-4 animate-spin" />
              ) : (
                <LuSend className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
              )
            }
            className="w-full sm:w-auto shadow-xs min-w-36"
          >
            {isSubmitting ? "Sending..." : t("submit")}
          </Button>

          <p className="text-xs text-muted-foreground leading-relaxed text-center sm:text-start">
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
