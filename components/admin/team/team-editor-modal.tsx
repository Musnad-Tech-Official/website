/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import {
  LuX,
  LuUpload,
  LuLoader,
  LuUser,
  LuLink,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { uploadImageAction } from "@/lib/storage/actions";
import type { TeamMember, TeamMemberFormData } from "@/lib/team/types";

interface TeamEditorModalProps {
  member?: TeamMember | null;
  locale: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TeamMemberFormData) => Promise<boolean>;
}

export function TeamEditorModal(props: TeamEditorModalProps) {
  if (!props.isOpen) return null;
  return <TeamEditorModalContent key={props.member?.id ?? "new"} {...props} />;
}

function TeamEditorModalContent({
  member,
  locale,
  onClose,
  onSave,
}: TeamEditorModalProps) {
  const isRtl = locale === "ar";
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [errorAlert, setErrorAlert] = React.useState<string | null>(null);

  // Form states
  const [nameEn, setNameEn] = React.useState(member?.nameEn || "");
  const [nameAr, setNameAr] = React.useState(member?.nameAr || "");
  const [slug, setSlug] = React.useState(member?.slug || "");
  const [roleEn, setRoleEn] = React.useState(member?.roleEn || "");
  const [roleAr, setRoleAr] = React.useState(member?.roleAr || "");
  const [bioEn, setBioEn] = React.useState(member?.bioEn || "");
  const [bioAr, setBioAr] = React.useState(member?.bioAr || "");
  const [department, setDepartment] = React.useState(member?.department || "Engineering");
  const [skillsInput, setSkillsInput] = React.useState(member?.skills?.join(", ") || "");
  const [image, setImage] = React.useState(member?.image || "");
  const [initials, setInitials] = React.useState(member?.initials || "");
  const [displayOrder, setDisplayOrder] = React.useState(member?.displayOrder ?? 0);
  const [isActive, setIsActive] = React.useState(member?.isActive ?? true);

  // Social links
  const [github, setGithub] = React.useState(member?.socialLinks?.github || "");
  const [linkedin, setLinkedin] = React.useState(member?.socialLinks?.linkedin || "");
  const [x, setX] = React.useState(member?.socialLinks?.x || "");
  const [website, setWebsite] = React.useState(member?.socialLinks?.website || "");

  const handleNameEnChange = (val: string) => {
    setNameEn(val);
    if (!member && !slug) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");
      setSlug(generated);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorAlert(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadImageAction(formData, "article-media");
      if (res.success && res.url) {
        setImage(res.url);
      } else {
        setErrorAlert(res.error || "Failed to upload image.");
      }
    } catch (err: unknown) {
      setErrorAlert((err as Error).message || "Upload error.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!nameEn.trim() || !nameAr.trim()) {
      setErrorAlert(isRtl ? "يرجى إدخال اسم العضو باللغتين." : "Please enter the member name in both languages.");
      return;
    }
    if (!roleEn.trim() || !roleAr.trim()) {
      setErrorAlert(isRtl ? "يرجى إدخال المسمى الوظيفي باللغتين." : "Please enter the job title in both languages.");
      return;
    }

    setIsSaving(true);
    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const data: TeamMemberFormData = {
      id: member?.id,
      slug: slug || nameEn.toLowerCase().replace(/\s+/g, "-"),
      nameEn,
      nameAr,
      roleEn,
      roleAr,
      bioEn,
      bioAr,
      image: image || undefined,
      initials: initials || nameEn.slice(0, 2).toUpperCase(),
      department,
      skills,
      displayOrder: Number(displayOrder) || 0,
      isActive,
      socialLinks: {
        github: github || undefined,
        linkedin: linkedin || undefined,
        x: x || undefined,
        website: website || undefined,
      },
    };

    const success = await onSave(data);
    setIsSaving(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in-50">
      <div className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-4xl my-auto flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <LuUser className="w-5 h-5 text-primary" />
              <span>
                {member
                  ? isRtl
                    ? "تعديل بيانات عضو الفريق"
                    : "Edit Team Member"
                  : isRtl
                  ? "إضافة عضو فريق جديد"
                  : "Add New Team Member"}
              </span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isRtl
                ? "إدارة السيرة المهنية، المسمى الوظيفي، والملف التعريفي للعضو."
                : "Manage professional bio, role, and public profile for this team member."}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-lg cursor-pointer"
            aria-label="Close"
          >
            <LuX className="w-4 h-4" />
          </Button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorAlert && (
            <Alert
              variant="destructive"
              onClose={() => setErrorAlert(null)}
            >
              <AlertTitle>{isRtl ? "خطأ" : "Error"}</AlertTitle>
              <AlertDescription>{errorAlert}</AlertDescription>
            </Alert>
          )}

          {/* Names Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                {isRtl ? "الاسم الكامل (الإنجليزية)" : "Full Name (English)"} *
              </label>
              <Input
                value={nameEn}
                onChange={(e) => handleNameEnChange(e.target.value)}
                placeholder="e.g. Sabri Alshaibani"
                className="h-9"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                {isRtl ? "الاسم الكامل (العربية)" : "Full Name (Arabic)"} *
              </label>
              <Input
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="مثال: صبري الشيباني"
                dir="rtl"
                className="h-9 text-end"
              />
            </div>
          </div>

          {/* Slug & Initials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-foreground mb-1">
                {isRtl ? "الرابط الدائم (Slug)" : "Permanent URL Slug"} *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-mono text-xs">/team/</span>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="sabri-alshaibani"
                  className="h-9 font-mono text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                {isRtl ? "الحروف الأولى (Initials)" : "Initials"}
              </label>
              <Input
                value={initials}
                onChange={(e) => setInitials(e.target.value.toUpperCase())}
                placeholder="SS"
                maxLength={4}
                className="h-9 font-mono uppercase"
              />
            </div>
          </div>

          {/* Roles & Department */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                {isRtl ? "المسمى الوظيفي (الإنجليزية)" : "Role / Title (English)"} *
              </label>
              <Input
                value={roleEn}
                onChange={(e) => setRoleEn(e.target.value)}
                placeholder="Engineering / Technical Lead"
                className="h-9"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                {isRtl ? "المسمى الوظيفي (العربية)" : "Role / Title (Arabic)"} *
              </label>
              <Input
                value={roleAr}
                onChange={(e) => setRoleAr(e.target.value)}
                placeholder="القائد الهندسي / التقني"
                dir="rtl"
                className="h-9 text-end"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                {isRtl ? "القسم / التخصص" : "Department"}
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-9 px-3 bg-muted/40 border border-border/80 rounded-lg text-xs text-foreground cursor-pointer focus:outline-none"
              >
                <option value="Leadership">Leadership</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
          </div>

          {/* Biographies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Textarea
                label={isRtl ? "السيرة المهنية (الإنجليزية)" : "Bio (English)"}
                value={bioEn}
                onChange={(e) => setBioEn(e.target.value)}
                placeholder="Detailed biography, background, and focus..."
                rows={3}
              />
            </div>
            <div>
              <Textarea
                label={isRtl ? "السيرة المهنية (العربية)" : "Bio (Arabic)"}
                value={bioAr}
                onChange={(e) => setBioAr(e.target.value)}
                placeholder="نبذة مفصلة عن الخبرات والمجال الهندسي..."
                rows={3}
                dir="rtl"
                className="text-end"
              />
            </div>
          </div>

          {/* Skills & Order */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-muted/20 border border-border/70">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1">
                {isRtl ? "المهارات والخبرات (مفصولة بفاصلة)" : "Skills & Focus (comma-separated)"}
              </label>
              <Input
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="Cloud Architecture, Next.js, PostgreSQL"
                className="h-9 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                {isRtl ? "ترتيب الظهور (Display Order)" : "Display Order"}
              </label>
              <Input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                className="h-9"
              />
            </div>
          </div>

          {/* Photo & Avatar */}
          <div className="p-4 rounded-xl bg-muted/20 border border-border/70 space-y-3">
            <label className="block text-xs font-semibold text-foreground">
              {isRtl ? "صورة العضو (Portrait Photo)" : "Member Portrait Photo"}
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="h-20 w-20 rounded-2xl overflow-hidden bg-muted border border-border flex items-center justify-center shrink-0">
                {image ? (
                  <img src={image} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-muted-foreground">{initials || "SA"}</span>
                )}
              </div>
              <div className="flex-1 w-full space-y-2">
                <Input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://.../photo.jpg"
                  className="h-9 text-xs"
                />
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-background hover:bg-muted text-xs font-medium text-foreground transition-colors shadow-2xs">
                    <LuUpload className="w-3.5 h-3.5" />
                    <span>{isUploading ? "Uploading..." : isRtl ? "رفع صورة" : "Upload File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                  {image && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setImage("")}
                      className="h-8 text-xs text-destructive hover:text-destructive cursor-pointer"
                    >
                      {isRtl ? "حذف الصورة" : "Remove"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <LuLink className="w-3.5 h-3.5" />
              <span>{isRtl ? "روابط التواصل الاجتماعي" : "Social Links"}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="GitHub: https://github.com/..."
                className="h-9 text-xs"
              />
              <Input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="LinkedIn: https://linkedin.com/in/..."
                className="h-9 text-xs"
              />
              <Input
                value={x}
                onChange={(e) => setX(e.target.value)}
                placeholder="X / Twitter: https://x.com/..."
                className="h-9 text-xs"
              />
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Website / Portfolio: https://..."
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Active status */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActiveCheck"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
            />
            <label htmlFor="isActiveCheck" className="text-xs font-medium text-foreground cursor-pointer">
              {isRtl ? "عضو نشط (يظهر في الموقع العام)" : "Active member (visible on public website)"}
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSaving} className="cursor-pointer">
            {isRtl ? "إلغاء" : "Cancel"}
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSaving}
            className="gap-2 cursor-pointer bg-primary text-primary-foreground font-semibold px-5"
          >
            {isSaving && <LuLoader className="w-3.5 h-3.5 animate-spin" />}
            <span>
              {member
                ? isRtl
                  ? "حفظ التغييرات"
                  : "Save Changes"
                : isRtl
                ? "إضافة العضو"
                : "Create Member"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
