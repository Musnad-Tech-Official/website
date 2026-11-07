"use client";

import * as React from "react";
import {
  LuTarget,
  LuEye,
  LuSlidersHorizontal,
  LuShieldCheck,
  LuSave,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuFileText,
  LuClock,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type {
  AboutContentData,
  AboutValueRecord,
  AboutMilestoneRecord,
  AboutApproachRecord,
} from "@/lib/about/types";
import {
  updateAboutContentAction,
  upsertAboutValueAction,
  deleteAboutValueAction,
  upsertAboutMilestoneAction,
  deleteAboutMilestoneAction,
  upsertAboutApproachAction,
  deleteAboutApproachAction,
} from "@/lib/about/actions";

interface AboutClientProps {
  initialContent: AboutContentData;
  initialValues: AboutValueRecord[];
  initialMilestones: AboutMilestoneRecord[];
  initialApproach: AboutApproachRecord[];
  locale: string;
}

export function AboutClient({
  initialContent,
  initialValues,
  initialMilestones,
  initialApproach,
  locale,
}: AboutClientProps) {
  const isAr = locale === "ar";
  const [activeTab, setActiveTab] = React.useState<"mission" | "values" | "milestones" | "approach">("mission");

  // Content state
  const [content, setContent] = React.useState<AboutContentData>(initialContent);
  const [isSavingContent, setIsSavingContent] = React.useState(false);

  // Values state
  const [values, setValues] = React.useState<AboutValueRecord[]>(initialValues);
  const [valueModalOpen, setValueModalOpen] = React.useState(false);
  const [editingValue, setEditingValue] = React.useState<AboutValueRecord | null>(null);

  // Milestones state
  const [milestones, setMilestones] = React.useState<AboutMilestoneRecord[]>(initialMilestones);
  const [milestoneModalOpen, setMilestoneModalOpen] = React.useState(false);
  const [editingMilestone, setEditingMilestone] = React.useState<AboutMilestoneRecord | null>(null);

  // Approach state
  const [approach, setApproach] = React.useState<AboutApproachRecord[]>(initialApproach);
  const [approachModalOpen, setApproachModalOpen] = React.useState(false);
  const [editingApproach, setEditingApproach] = React.useState<AboutApproachRecord | null>(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = React.useState<{
    type: "value" | "milestone" | "approach";
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Notification
  const [alert, setAlert] = React.useState<{ type: "success" | "destructive"; message: string } | null>(null);
  const showAlert = (message: string, type: "success" | "destructive" = "success") => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  // Save Main Content
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContent(true);
    try {
      await updateAboutContentAction(content);
      showAlert(isAr ? "تم حفظ محتوى من نحن بنجاح" : "About content saved successfully.");
    } catch {
      showAlert(isAr ? "فشل حفظ المحتوى" : "Failed to save content.", "destructive");
    } finally {
      setIsSavingContent(false);
    }
  };

  // Value Save
  const handleSaveValue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingValue) return;
    try {
      await upsertAboutValueAction(editingValue);
      setValues((prev) => {
        const idx = prev.findIndex((v) => v.id === editingValue.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = editingValue;
          return next;
        }
        return [...prev, editingValue];
      });
      setValueModalOpen(false);
      showAlert(isAr ? "تم حفظ القيمة بنجاح" : "Value saved successfully.");
    } catch {
      showAlert(isAr ? "فشل حفظ القيمة" : "Failed to save value.", "destructive");
    }
  };

  // Milestone Save
  const handleSaveMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone) return;
    try {
      await upsertAboutMilestoneAction(editingMilestone);
      setMilestones((prev) => {
        const idx = prev.findIndex((m) => m.id === editingMilestone.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = editingMilestone;
          return next;
        }
        return [...prev, editingMilestone];
      });
      setMilestoneModalOpen(false);
      showAlert(isAr ? "تم حفظ المحطة بنجاح" : "Milestone saved successfully.");
    } catch {
      showAlert(isAr ? "فشل حفظ المحطة" : "Failed to save milestone.", "destructive");
    }
  };

  // Approach Save
  const handleSaveApproach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApproach) return;
    try {
      await upsertAboutApproachAction(editingApproach);
      setApproach((prev) => {
        const idx = prev.findIndex((a) => a.id === editingApproach.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = editingApproach;
          return next;
        }
        return [...prev, editingApproach];
      });
      setApproachModalOpen(false);
      showAlert(isAr ? "تم حفظ الخطوة بنجاح" : "Approach step saved successfully.");
    } catch {
      showAlert(isAr ? "فشل حفظ الخطوة" : "Failed to save step.", "destructive");
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === "value") {
        await deleteAboutValueAction(deleteTarget.id);
        setValues((prev) => prev.filter((v) => v.id !== deleteTarget.id));
      } else if (deleteTarget.type === "milestone") {
        await deleteAboutMilestoneAction(deleteTarget.id);
        setMilestones((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      } else if (deleteTarget.type === "approach") {
        await deleteAboutApproachAction(deleteTarget.id);
        setApproach((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      }
      showAlert(isAr ? "تم الحذف بنجاح" : "Deleted successfully.");
    } catch {
      showAlert(isAr ? "فشل الحذف" : "Failed to delete.", "destructive");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <LuTarget className="w-6 h-6 text-primary" />
            <span>{isAr ? "إدارة صفحة من نحن" : "About Us Page CMS"}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {isAr
              ? "التحكم في الرؤية والرسالة، قيم الشركة، محطات التاريخ، ومنهجية العمل بدون كتابة أكواد."
              : "Manage mission & vision, company values, milestones timeline, and delivery approach dynamically."}
          </p>
        </div>
      </div>

      {alert && (
        <Alert variant={alert.type}>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border/60 pb-3">
        <Button
          variant={activeTab === "mission" ? "primary" : "outline"}
          size="sm"
          onClick={() => setActiveTab("mission")}
          className="gap-2 text-xs"
        >
          <LuTarget className="w-4 h-4" />
          <span>{isAr ? "الرسالة والرؤية والقصة" : "Mission, Vision & Story"}</span>
        </Button>
        <Button
          variant={activeTab === "values" ? "primary" : "outline"}
          size="sm"
          onClick={() => setActiveTab("values")}
          className="gap-2 text-xs"
        >
          <LuShieldCheck className="w-4 h-4" />
          <span>{isAr ? "قيم الشركة" : "Company Values"}</span>
          <Badge variant="secondary" className="ms-1 px-1.5 py-0 text-[10px]">
            {values.length}
          </Badge>
        </Button>
        <Button
          variant={activeTab === "milestones" ? "primary" : "outline"}
          size="sm"
          onClick={() => setActiveTab("milestones")}
          className="gap-2 text-xs"
        >
          <LuClock className="w-4 h-4" />
          <span>{isAr ? "المحطات التاريخية" : "Milestones"}</span>
          <Badge variant="secondary" className="ms-1 px-1.5 py-0 text-[10px]">
            {milestones.length}
          </Badge>
        </Button>
        <Button
          variant={activeTab === "approach" ? "primary" : "outline"}
          size="sm"
          onClick={() => setActiveTab("approach")}
          className="gap-2 text-xs"
        >
          <LuSlidersHorizontal className="w-4 h-4" />
          <span>{isAr ? "منهجية العمل" : "Delivery Approach"}</span>
          <Badge variant="secondary" className="ms-1 px-1.5 py-0 text-[10px]">
            {approach.length}
          </Badge>
        </Button>
      </div>

      {/* Tab 1: Mission, Vision & Story */}
      {activeTab === "mission" && (
        <form onSubmit={handleSaveContent} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mission Card */}
            <Card>
              <CardHeader className="p-5 pb-3 border-b border-border/40">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <LuTarget className="w-4 h-4 text-primary" />
                  <span>{isAr ? "رسالة الشركة (Our Mission)" : "Our Mission"}</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  {isAr ? "النص المعروض في قسم الرسالة على الموقع" : "Displayed in the Mission card on About page"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Title (EN)</label>
                  <Input
                    value={content.missionTitleEn}
                    onChange={(e) => setContent({ ...content, missionTitleEn: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">العنوان (عربي)</label>
                  <Input
                    dir="rtl"
                    value={content.missionTitleAr}
                    onChange={(e) => setContent({ ...content, missionTitleAr: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Description (EN)</label>
                  <Textarea
                    rows={3}
                    value={content.missionDescEn}
                    onChange={(e) => setContent({ ...content, missionDescEn: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">الوصف (عربي)</label>
                  <Textarea
                    dir="rtl"
                    rows={3}
                    value={content.missionDescAr}
                    onChange={(e) => setContent({ ...content, missionDescAr: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Vision Card */}
            <Card>
              <CardHeader className="p-5 pb-3 border-b border-border/40">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <LuEye className="w-4 h-4 text-primary" />
                  <span>{isAr ? "رؤية الشركة (Our Vision)" : "Our Vision"}</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  {isAr ? "النص المعروض في بطاقة الرؤية" : "Displayed in the Vision card on About page"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Title (EN)</label>
                  <Input
                    value={content.visionTitleEn}
                    onChange={(e) => setContent({ ...content, visionTitleEn: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">العنوان (عربي)</label>
                  <Input
                    dir="rtl"
                    value={content.visionTitleAr}
                    onChange={(e) => setContent({ ...content, visionTitleAr: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Description (EN)</label>
                  <Textarea
                    rows={3}
                    value={content.visionDescEn}
                    onChange={(e) => setContent({ ...content, visionDescEn: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">الوصف (عربي)</label>
                  <Textarea
                    dir="rtl"
                    rows={3}
                    value={content.visionDescAr}
                    onChange={(e) => setContent({ ...content, visionDescAr: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Story Card */}
          <Card>
            <CardHeader className="p-5 pb-3 border-b border-border/40">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <LuFileText className="w-4 h-4 text-primary" />
                <span>{isAr ? "قصة التأسيس (How We Got Here)" : "Our Story & Background"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Story Section Title (EN)</label>
                  <Input
                    value={content.storyTitleEn}
                    onChange={(e) => setContent({ ...content, storyTitleEn: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">عنوان قسم القصة (عربي)</label>
                  <Input
                    dir="rtl"
                    value={content.storyTitleAr}
                    onChange={(e) => setContent({ ...content, storyTitleAr: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Paragraph 1 (EN)</label>
                  <Textarea
                    rows={4}
                    value={content.storyP1En}
                    onChange={(e) => setContent({ ...content, storyP1En: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">الفقرة 1 (عربي)</label>
                  <Textarea
                    dir="rtl"
                    rows={4}
                    value={content.storyP1Ar}
                    onChange={(e) => setContent({ ...content, storyP1Ar: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Paragraph 2 (EN)</label>
                  <Textarea
                    rows={4}
                    value={content.storyP2En}
                    onChange={(e) => setContent({ ...content, storyP2En: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">الفقرة 2 (عربي)</label>
                  <Textarea
                    dir="rtl"
                    rows={4}
                    value={content.storyP2Ar}
                    onChange={(e) => setContent({ ...content, storyP2Ar: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={isSavingContent} className="gap-2">
              <LuSave className="w-4 h-4" />
              <span>{isSavingContent ? (isAr ? "جار الحفظ..." : "Saving...") : (isAr ? "حفظ التغييرات" : "Save Changes")}</span>
            </Button>
          </div>
        </form>
      )}

      {/* Tab 2: Values */}
      {activeTab === "values" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              {isAr ? "القيم المؤسسية المعروضة على صفحة من نحن" : "Corporate principles shown on the About page"}
            </p>
            <Button
              size="sm"
              variant="primary"
              className="gap-2 text-xs"
              onClick={() => {
                setEditingValue({
                  id: `val-${Date.now()}`,
                  titleEn: "",
                  titleAr: "",
                  descriptionEn: "",
                  descriptionAr: "",
                  icon: "LuShieldCheck",
                  displayOrder: values.length + 1,
                  isActive: true,
                });
                setValueModalOpen(true);
              }}
            >
              <LuPlus className="w-4 h-4" />
              <span>{isAr ? "إضافة قيمة جديدة" : "Add Value"}</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.map((v) => (
              <Card key={v.id} className="p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      #{v.displayOrder} • {v.id}
                    </span>
                    <Badge variant={v.isActive ? "default" : "secondary"}>
                      {v.isActive ? (isAr ? "نشط" : "Active") : (isAr ? "مخفي" : "Hidden")}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-base text-foreground">
                    {isAr ? v.titleAr || v.titleEn : v.titleEn}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isAr ? v.descriptionAr || v.descriptionEn : v.descriptionEn}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 text-xs"
                    onClick={() => {
                      setEditingValue(v);
                      setValueModalOpen(true);
                    }}
                  >
                    <LuPencil className="w-3.5 h-3.5" />
                    <span>{isAr ? "تعديل" : "Edit"}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteTarget({ type: "value", id: v.id, name: v.titleEn })}
                  >
                    <LuTrash2 className="w-3.5 h-3.5" />
                    <span>{isAr ? "حذف" : "Delete"}</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Milestones */}
      {activeTab === "milestones" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              {isAr ? "المحطات التاريخية والزمنية للمؤسسة" : "Historical company milestones timeline"}
            </p>
            <Button
              size="sm"
              variant="primary"
              className="gap-2 text-xs"
              onClick={() => {
                setEditingMilestone({
                  id: `ms-${Date.now()}`,
                  year: new Date().getFullYear().toString(),
                  titleEn: "",
                  titleAr: "",
                  descriptionEn: "",
                  descriptionAr: "",
                  displayOrder: milestones.length + 1,
                  isActive: true,
                });
                setMilestoneModalOpen(true);
              }}
            >
              <LuPlus className="w-4 h-4" />
              <span>{isAr ? "إضافة محطة تاريخية" : "Add Milestone"}</span>
            </Button>
          </div>

          <div className="space-y-3">
            {milestones.map((m) => (
              <Card key={m.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-primary shrink-0">
                    {m.year}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      {isAr ? m.titleAr || m.titleEn : m.titleEn}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {isAr ? m.descriptionAr || m.descriptionEn : m.descriptionEn}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 text-xs"
                    onClick={() => {
                      setEditingMilestone(m);
                      setMilestoneModalOpen(true);
                    }}
                  >
                    <LuPencil className="w-3.5 h-3.5" />
                    <span>{isAr ? "تعديل" : "Edit"}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteTarget({ type: "milestone", id: m.id, name: `${m.year} - ${m.titleEn}` })}
                  >
                    <LuTrash2 className="w-3.5 h-3.5" />
                    <span>{isAr ? "حذف" : "Delete"}</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Approach */}
      {activeTab === "approach" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              {isAr ? "خطوات ومنهجية التسليم الهندسي" : "Engineering process and delivery steps"}
            </p>
            <Button
              size="sm"
              variant="primary"
              className="gap-2 text-xs"
              onClick={() => {
                setEditingApproach({
                  id: `app-${Date.now()}`,
                  stepNumber: `0${approach.length + 1}`,
                  titleEn: "",
                  titleAr: "",
                  descriptionEn: "",
                  descriptionAr: "",
                  displayOrder: approach.length + 1,
                  isActive: true,
                });
                setApproachModalOpen(true);
              }}
            >
              <LuPlus className="w-4 h-4" />
              <span>{isAr ? "إضافة خطوة منهجية" : "Add Step"}</span>
            </Button>
          </div>

          <div className="space-y-3">
            {approach.map((a) => (
              <Card key={a.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted border border-border/80 flex items-center justify-center font-mono font-bold text-base text-foreground shrink-0">
                    {a.stepNumber}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      {isAr ? a.titleAr || a.titleEn : a.titleEn}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {isAr ? a.descriptionAr || a.descriptionEn : a.descriptionEn}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 text-xs"
                    onClick={() => {
                      setEditingApproach(a);
                      setApproachModalOpen(true);
                    }}
                  >
                    <LuPencil className="w-3.5 h-3.5" />
                    <span>{isAr ? "تعديل" : "Edit"}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteTarget({ type: "approach", id: a.id, name: a.titleEn })}
                  >
                    <LuTrash2 className="w-3.5 h-3.5" />
                    <span>{isAr ? "حذف" : "Delete"}</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Value Modal */}
      {valueModalOpen && editingValue && (
        <Dialog open={valueModalOpen} onOpenChange={setValueModalOpen}>
          <DialogContent className="max-w-lg">
            <form onSubmit={handleSaveValue}>
              <DialogHeader>
                <DialogTitle>{isAr ? "تعديل قيمة مؤسسية" : "Edit Value"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">ID</label>
                  <Input
                    value={editingValue.id}
                    onChange={(e) => setEditingValue({ ...editingValue, id: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Title (EN)</label>
                    <Input
                      value={editingValue.titleEn}
                      onChange={(e) => setEditingValue({ ...editingValue, titleEn: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">العنوان (عربي)</label>
                    <Input
                      dir="rtl"
                      value={editingValue.titleAr}
                      onChange={(e) => setEditingValue({ ...editingValue, titleAr: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Description (EN)</label>
                  <Textarea
                    rows={2}
                    value={editingValue.descriptionEn}
                    onChange={(e) => setEditingValue({ ...editingValue, descriptionEn: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">الوصف (عربي)</label>
                  <Textarea
                    dir="rtl"
                    rows={2}
                    value={editingValue.descriptionAr}
                    onChange={(e) => setEditingValue({ ...editingValue, descriptionAr: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Display Order</label>
                    <Input
                      type="number"
                      value={editingValue.displayOrder}
                      onChange={(e) => setEditingValue({ ...editingValue, displayOrder: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Icon</label>
                    <Input
                      value={editingValue.icon}
                      onChange={(e) => setEditingValue({ ...editingValue, icon: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setValueModalOpen(false)}>
                  {isAr ? "إلغاء" : "Cancel"}
                </Button>
                <Button type="submit" variant="primary">
                  {isAr ? "حفظ" : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Milestone Modal */}
      {milestoneModalOpen && editingMilestone && (
        <Dialog open={milestoneModalOpen} onOpenChange={setMilestoneModalOpen}>
          <DialogContent className="max-w-lg">
            <form onSubmit={handleSaveMilestone}>
              <DialogHeader>
                <DialogTitle>{isAr ? "تعديل محطة تاريخية" : "Edit Milestone"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Year / السنة</label>
                    <Input
                      value={editingMilestone.year}
                      onChange={(e) => setEditingMilestone({ ...editingMilestone, year: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Display Order</label>
                    <Input
                      type="number"
                      value={editingMilestone.displayOrder}
                      onChange={(e) => setEditingMilestone({ ...editingMilestone, displayOrder: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Title (EN)</label>
                    <Input
                      value={editingMilestone.titleEn}
                      onChange={(e) => setEditingMilestone({ ...editingMilestone, titleEn: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">العنوان (عربي)</label>
                    <Input
                      dir="rtl"
                      value={editingMilestone.titleAr}
                      onChange={(e) => setEditingMilestone({ ...editingMilestone, titleAr: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Description (EN)</label>
                  <Textarea
                    rows={2}
                    value={editingMilestone.descriptionEn}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, descriptionEn: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">الوصف (عربي)</label>
                  <Textarea
                    dir="rtl"
                    rows={2}
                    value={editingMilestone.descriptionAr}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, descriptionAr: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setMilestoneModalOpen(false)}>
                  {isAr ? "إلغاء" : "Cancel"}
                </Button>
                <Button type="submit" variant="primary">
                  {isAr ? "حفظ" : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Approach Modal */}
      {approachModalOpen && editingApproach && (
        <Dialog open={approachModalOpen} onOpenChange={setApproachModalOpen}>
          <DialogContent className="max-w-lg">
            <form onSubmit={handleSaveApproach}>
              <DialogHeader>
                <DialogTitle>{isAr ? "تعديل خطوة منهجية" : "Edit Approach Step"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Step Number (e.g. 01)</label>
                    <Input
                      value={editingApproach.stepNumber}
                      onChange={(e) => setEditingApproach({ ...editingApproach, stepNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Display Order</label>
                    <Input
                      type="number"
                      value={editingApproach.displayOrder}
                      onChange={(e) => setEditingApproach({ ...editingApproach, displayOrder: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Title (EN)</label>
                    <Input
                      value={editingApproach.titleEn}
                      onChange={(e) => setEditingApproach({ ...editingApproach, titleEn: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">العنوان (عربي)</label>
                    <Input
                      dir="rtl"
                      value={editingApproach.titleAr}
                      onChange={(e) => setEditingApproach({ ...editingApproach, titleAr: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Description (EN)</label>
                  <Textarea
                    rows={2}
                    value={editingApproach.descriptionEn}
                    onChange={(e) => setEditingApproach({ ...editingApproach, descriptionEn: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">الوصف (عربي)</label>
                  <Textarea
                    dir="rtl"
                    rows={2}
                    value={editingApproach.descriptionAr}
                    onChange={(e) => setEditingApproach({ ...editingApproach, descriptionAr: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setApproachModalOpen(false)}>
                  {isAr ? "إلغاء" : "Cancel"}
                </Button>
                <Button type="submit" variant="primary">
                  {isAr ? "حفظ" : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          open={Boolean(deleteTarget)}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title={isAr ? "تأكيد الحذف" : "Confirm Deletion"}
          description={
            isAr
              ? `هل أنت متأكد من رغبتك في حذف "${deleteTarget.name}"؟`
              : `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
          }
          confirmLabel={isAr ? "حذف" : "Delete"}
          cancelLabel={isAr ? "إلغاء" : "Cancel"}
          variant="destructive"
          isLoading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
