"use client";

import React, { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LuPlus, LuFileText, LuX, LuCheck } from "react-icons/lu";
import type { JobApplicationFormProps } from "./job-detail-types";
import { cn } from "@/lib/utils";

export function JobApplicationForm({
  cvRequired,
  className = "",
}: JobApplicationFormProps) {
  const t = useTranslations("JobDetail.common.form");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Validation & UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      if (errors.cv) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.cv;
          return next;
        });
      }
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = t("errors.nameRequired");
    }
    if (!email.trim() || !email.includes("@")) {
      newErrors.email = t("errors.emailRequired");
    }
    if (!coverLetter.trim()) {
      newErrors.coverLetter = t("errors.coverLetterRequired");
    }
    if (cvRequired && !selectedFile) {
      newErrors.cv = t("errors.cvRequired");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Frontend-only presentation simulation (no live backend)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setLocation("");
    setPortfolioUrl("");
    setGithub("");
    setLinkedin("");
    setCoverLetter("");
    setSelectedFile(null);
    setErrors({});
    setIsSubmitted(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (isSubmitted) {
    return (
      <aside
        aria-label={t("title")}
        className={cn(
          "rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs text-center",
          className
        )}
      >
        <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
          <LuCheck className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold font-serif rtl:font-sans text-foreground mb-2">
          {t("successTitle")}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          {t("successMessage")}
        </p>
        <Button
          variant="outline"
          onClick={handleReset}
          className="rounded-xl w-full font-medium"
        >
          {t("resetForm")}
        </Button>
      </aside>
    );
  }

  return (
    <aside
      aria-labelledby="application-form-title"
      className={cn(
        "rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs text-start",
        className
      )}
    >
      <div className="mb-6">
        <h2
          id="application-form-title"
          className="text-xl sm:text-2xl font-bold font-serif rtl:font-sans text-foreground mb-1.5"
        >
          {t("title")}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="applicant-name"
            label={t("nameLabel")}
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.name;
                  return next;
                });
              }
            }}
            error={errors.name}
          />
          <Input
            id="applicant-email"
            type="email"
            label={t("emailLabel")}
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.email;
                  return next;
                });
              }
            }}
            error={errors.email}
          />
        </div>

        {/* Phone & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="applicant-phone"
            type="tel"
            label={`${t("phoneLabel")} ()`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            id="applicant-location"
            label={`${t("locationLabel")} ()`}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Portfolio URL */}
        <Input
          id="applicant-portfolio"
          type="url"
          label={`${t("portfolioLabel")} ()`}
          placeholder={t("portfolioPlaceholder")}
          value={portfolioUrl}
          onChange={(e) => setPortfolioUrl(e.target.value)}
        />

        {/* GitHub & LinkedIn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="applicant-github"
            label={`${t("githubLabel")} ()`}
            placeholder={t("githubPlaceholder")}
            value={github}
            onChange={(e) => setGithub(e.target.value)}
          />
          <Input
            id="applicant-linkedin"
            label={`${t("linkedinLabel")} ()`}
            placeholder={t("linkedinPlaceholder")}
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
          />
        </div>

        {/* Cover Letter */}
        <Textarea
          id="applicant-cover-letter"
          label={t("coverLetterLabel")}
          required
          rows={4}
          placeholder={t("coverLetterPlaceholder")}
          value={coverLetter}
          onChange={(e) => {
            setCoverLetter(e.target.value);
            if (errors.coverLetter) {
              setErrors((prev) => {
                const next = { ...prev };
                delete next.coverLetter;
                return next;
              });
            }
          }}
          error={errors.coverLetter}
        />

        {/* CV / Resume Upload Box */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            {t("cvLabel")}{" "}
            {cvRequired ? (
              <span className="text-primary">*</span>
            ) : (
              <span className="text-xs font-normal text-muted-foreground">
                {t("optionalTag")}
              </span>
            )}
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="sr-only"
            id="applicant-cv"
            aria-describedby="cv-helper-text"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-xl p-4 sm:p-5 text-center transition-colors cursor-pointer bg-muted/20 hover:bg-muted/40",
              errors.cv ? "border-destructive text-destructive" : "border-border/80 hover:border-primary/60"
            )}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            {selectedFile ? (
              <div className="flex items-center justify-between gap-3 text-start">
                <div className="flex items-center gap-2.5 min-w-0">
                  <LuFileText className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                    {selectedFile.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                  aria-label="Remove uploaded file"
                >
                  <LuX className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-1.5 py-1">
                <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium text-foreground">
                  <LuPlus className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
                  <span>{t("clickToUpload")}</span>
                </div>
                <span className="text-[11px] sm:text-xs text-muted-foreground">
                  {t("uploadTypes")}
                </span>
              </div>
            )}
          </div>

          {errors.cv && (
            <p className="text-xs font-medium text-destructive mt-1">
              {errors.cv}
            </p>
          )}

          <p id="cv-helper-text" className="text-xs text-muted-foreground mt-1">
            {cvRequired ? t("cvRequiredNote") : t("cvOptionalNote")}
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full rounded-xl font-semibold bg-foreground text-background hover:bg-foreground/90 transition-colors cursor-pointer py-3"
          >
            {isSubmitting ? t("submittingButton") : t("submitButton")}
          </Button>

          <p className="text-[11px] sm:text-xs text-center text-muted-foreground mt-3 leading-relaxed">
            {t("disclaimer")}
          </p>
        </div>
      </form>
    </aside>
  );
}
