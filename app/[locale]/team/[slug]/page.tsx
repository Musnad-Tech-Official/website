/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CtaSection } from "@/components/ui/cta-section";
import { formatArticleDate } from "@/lib/utils/date";
import {
  getTeamMemberBySlugAction,
  getArticlesByAuthorAction,
} from "@/lib/team/actions";
import {
  LuChevronRight,
  LuArrowLeft,
  LuArrowRight,
  LuLayers,
  LuBookOpen,
  LuFileText,
  LuArrowUpRight,
  LuGlobe,
  LuMail,
  LuShieldCheck,
} from "react-icons/lu";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

interface TeamMemberDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: TeamMemberDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const member = await getTeamMemberBySlugAction(slug);

  if (!member) {
    return {
      title: "Team Member Not Found — Musnad Tech",
    };
  }

  const isRtl = locale === "ar";
  const name = isRtl ? member.nameAr : member.nameEn;
  const role = isRtl ? member.roleAr : member.roleEn;
  const bio = isRtl ? member.bioAr : member.bioEn;

  return {
    title: `${name} — ${role} — Musnad Tech`,
    description: bio || `${name} is ${role} at Musnad Tech.`,
  };
}

export default async function TeamMemberDetailPage({
  params,
}: TeamMemberDetailPageProps) {
  const { locale, slug } = await params;
  const isRtl = locale === "ar";

  const member = await getTeamMemberBySlugAction(slug);
  if (!member || !member.isActive) {
    notFound();
  }

  const articles = await getArticlesByAuthorAction(member.nameEn);

  const displayName = isRtl ? member.nameAr : member.nameEn;
  const altName = isRtl ? member.nameEn : member.nameAr;
  const displayRole = isRtl ? member.roleAr : member.roleEn;
  const displayBio = isRtl ? member.bioAr : member.bioEn;

  const BackArrowIcon = isRtl ? LuArrowRight : LuArrowLeft;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1 pb-16 pt-8 sm:pt-12 animate-in fade-in-50 duration-300">
      {/* 1. Breadcrumbs & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-muted-foreground">
            <li>
              <Link
                href="/"
                className="hover:text-foreground transition-colors rounded-sm px-1 py-0.5"
              >
                {isRtl ? "الرئيسية" : "Home"}
              </Link>
            </li>
            <li aria-hidden="true" className="select-none text-muted-foreground/60">
              <LuChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </li>
            <li>
              <Link
                href="/team"
                className="hover:text-foreground transition-colors rounded-sm px-1 py-0.5"
              >
                {isRtl ? "الفريق" : "Team"}
              </Link>
            </li>
            <li aria-hidden="true" className="select-none text-muted-foreground/60">
              <LuChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </li>
            <li aria-current="page" className="font-semibold text-foreground truncate">
              {displayName}
            </li>
          </ol>
        </nav>

        <Link href="/team">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl text-xs font-semibold cursor-pointer h-9 px-3.5 shadow-2xs"
          >
            <BackArrowIcon className="w-3.5 h-3.5" />
            <span>{isRtl ? "العودة لكافة الأعضاء" : "Back to Team"}</span>
          </Button>
        </Link>
      </div>

      {/* 2. Profile Hero Header */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-2xs mb-12">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
          {/* Portrait Container */}
          <div className="relative shrink-0 w-44 sm:w-56 aspect-4/5 rounded-2xl overflow-hidden border border-border/80 bg-[#eaeff3] dark:bg-muted/40 shadow-sm flex items-center justify-center">
            {member.image ? (
              <img
                src={member.image}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-4">
                <span className="text-4xl sm:text-5xl font-serif tracking-widest font-semibold text-foreground/80">
                  {member.initials || "MT"}
                </span>
              </div>
            )}
          </div>

          {/* Member Meta & Intro */}
          <div className="flex-1 text-center md:text-start space-y-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <Badge variant="secondary" size="sm" className="font-medium">
                {member.department}
              </Badge>
              <Badge variant="outline" size="sm" className="font-mono text-[11px] gap-1 text-primary">
                <LuShieldCheck className="w-3 h-3" />
                <span>{isRtl ? "فريق مسند المعتمد" : "Verified Musnad Lead"}</span>
              </Badge>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                {displayName}
              </h1>
              {altName && (
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  {altName}
                </p>
              )}
            </div>

            <p className="text-lg sm:text-xl font-medium text-primary">
              {displayRole}
            </p>

            {/* Social & Contact Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-2">
              {member.socialLinks?.github && (
                <a
                  href={member.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-xl border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  aria-label="GitHub Profile"
                >
                  <FaGithub className="w-4 h-4" />
                </a>
              )}

              {member.socialLinks?.linkedin && (
                <a
                  href={member.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-xl border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  aria-label="LinkedIn Profile"
                >
                  <FaLinkedinIn className="w-4 h-4" />
                </a>
              )}

              {member.socialLinks?.x && (
                <a
                  href={member.socialLinks.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-xl border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  aria-label="X Profile"
                >
                  <FaXTwitter className="w-4 h-4" />
                </a>
              )}

              {member.socialLinks?.website && (
                <a
                  href={member.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-xl border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  aria-label="Personal Website"
                >
                  <LuGlobe className="w-4 h-4" />
                </a>
              )}

              <Link href="/contact">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 rounded-xl text-xs font-semibold cursor-pointer h-10 px-4"
                >
                  <LuMail className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{isRtl ? "تواصل مع الفريق" : "Contact Team"}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Detailed Bio & Skills Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Biography Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6 sm:p-8 rounded-3xl border-border/80 shadow-2xs space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <LuBookOpen className="w-5 h-5 text-primary" />
              <span>{isRtl ? "نبذة عن المسيرة الهندسية" : "About & Leadership"}</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
              {displayBio ||
                (isRtl
                  ? `${displayName} يشغل منصب ${displayRole} في مسند للتقنية، ويعمل على بناء وتطوير الحلول البرمجية عالية الجودة والابتكار الرقمي.`
                  : `${displayName} serves as ${displayRole} at Musnad Tech, building modern digital solutions with a focus on engineering excellence and maintainable architecture.`)}
            </p>
          </Card>
        </div>

        {/* Skills Column (1 Col) */}
        <div className="space-y-4">
          <Card className="p-6 sm:p-8 rounded-3xl border-border/80 shadow-2xs space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <LuLayers className="w-5 h-5 text-primary" />
              <span>{isRtl ? "المهارات والتخصصات" : "Skills & Focus"}</span>
            </h2>

            {member.skills && member.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {member.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium text-foreground bg-muted/60 border border-border/60 shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                {isRtl ? "لم تُضف مهارات محددة بعد." : "No specific skills added yet."}
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* 4. Authored Articles Section */}
      <section className="space-y-6 mb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <LuFileText className="w-6 h-6 text-primary" />
              <span>
                {isRtl
                  ? `مقالات ورؤى هندسية بقلم ${displayName}`
                  : `Articles & Technical Insights by ${displayName}`}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {isRtl
                ? "مساهمات معرفية وأبحاث تطبيقية من واقع العمل الهندسي في مسند للتقنية."
                : "Knowledge contributions and engineering insights from active production experience."}
            </p>
          </div>

          {articles.length > 0 && (
            <Link href="/blog">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-xl text-xs font-semibold cursor-pointer h-9 px-3.5"
              >
                <span>{isRtl ? "كافة المقالات" : "Browse All Blog"}</span>
                <LuChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </Button>
            </Link>
          )}
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <Link
                key={art.id}
                href={`/blog/${art.slug}`}
                className="block h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
              >
                <Card
                  variant="interactive"
                  className="h-full flex flex-col overflow-hidden border border-border/80 bg-card hover:border-primary/50 transition-all duration-200"
                >
                  {/* Thumbnail */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-muted border-b border-border/60 flex items-center justify-center shrink-0">
                    {art.coverImage ? (
                      <img
                        src={art.coverImage}
                        alt={isRtl ? art.titleAr : art.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-xl border border-border/40 bg-background/40 backdrop-blur-xs flex items-center justify-center text-muted-foreground/60 shadow-xs group-hover:scale-105 transition-transform">
                        <LuArrowUpRight className="h-5 w-5 rtl:-scale-x-100" />
                      </div>
                    )}
                    {art.category && (
                      <div className="absolute top-3.5 start-3.5 z-10">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-background/80 text-foreground border border-border/70 backdrop-blur-xs shadow-2xs">
                          {art.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <time dateTime={art.publishedAt}>
                        {formatArticleDate(art.publishedAt, locale)}
                      </time>
                      <span aria-hidden="true">·</span>
                      <span>{isRtl ? art.readTimeAr : art.readTimeEn}</span>
                    </div>

                    <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {isRtl ? art.titleAr : art.titleEn}
                    </h3>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 mt-2">
                      {isRtl ? art.excerptAr : art.excerptEn}
                    </p>

                    {art.tags && art.tags.length > 0 && (
                      <div className="mt-auto pt-4 flex flex-wrap gap-1.5 border-t border-border/50">
                        {art.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono text-muted-foreground bg-muted/50 border border-border/40"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border border-dashed border-border rounded-2xl bg-card">
            <LuFileText className="w-8 h-8 mx-auto text-muted-foreground/60 mb-2" />
            <h3 className="text-sm font-semibold text-foreground">
              {isRtl ? "لم يتم نشر مقالات بعد لهذا العضو" : "No articles published by this member yet"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {isRtl
                ? "يمكنك متابعة مدونة مسند للاطلاع على كافة المقالات والمنشورات الهندسية لجميع الفريق."
                : "Explore the Musnad Tech engineering blog to read all articles published across the team."}
            </p>
            <div className="mt-4">
              <Link href="/blog">
                <Button variant="outline" size="sm" className="rounded-xl text-xs">
                  {isRtl ? "استكشاف المدونة" : "Explore Blog"}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 5. Bottom CTA */}
      <CtaSection
        title={
          isRtl
            ? `ابدأ العمل مع ${displayName} وفريق مسند`
            : `Collaborate with ${displayName} and the Musnad Team`
        }
        subtitle={
          isRtl
            ? "نساعدك في تحويل متطلباتك الهندسية وتحدياتك الرقمية إلى حلول برمجية مستدامة وقابلة للتوسع."
            : "Transforming technical ideas and high-complexity requirements into production-ready software systems."
        }
        primaryAction={{
          label: isRtl ? "ناقش مشروعك معنا" : "Discuss Your Project",
          href: "/contact",
          variant: "primary",
          showArrow: true,
        }}
        secondaryAction={{
          label: isRtl ? "استكشف كافة المشاريع" : "Explore Projects",
          href: "/projects",
          variant: "outline",
        }}
      />
    </div>
  );
}
