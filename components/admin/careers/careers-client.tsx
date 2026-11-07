"use client";

import * as React from "react";
import {
  LuBriefcase,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuMapPin,
  LuAward,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { CareerJobRecord, CareerValueRecord, JobDepartment, JobWorkMode } from "@/lib/careers/types";
import {
  upsertCareerJobAction,
  deleteCareerJobAction,
  upsertCareerValueAction,
  deleteCareerValueAction,
} from "@/lib/careers/actions";

interface CareersClientProps {
  initialJobs: CareerJobRecord[];
  initialValues: CareerValueRecord[];
  locale: string;
}

export function CareersClient({ initialJobs, initialValues, locale }: CareersClientProps) {
  const isAr = locale === "ar";
  const [activeTab, setActiveTab] = React.useState<"jobs" | "values">("jobs");

  const [jobs, setJobs] = React.useState<CareerJobRecord[]>(initialJobs);
  const [values, setValues] = React.useState<CareerValueRecord[]>(initialValues);

  // Job Modal
  const [jobModalOpen, setJobModalOpen] = React.useState(false);
  const [editingJob, setEditingJob] = React.useState<CareerJobRecord | null>(null);
  const [reqsEnInput, setReqsEnInput] = React.useState("");
  const [reqsArInput, setReqsArInput] = React.useState("");
  const [respsEnInput, setRespsEnInput] = React.useState("");
  const [respsArInput, setRespsArInput] = React.useState("");

  // Value Modal
  const [valueModalOpen, setValueModalOpen] = React.useState(false);
  const [editingValue, setEditingValue] = React.useState<CareerValueRecord | null>(null);

  // Delete Target
  const [deleteTarget, setDeleteTarget] = React.useState<{
    type: "job" | "value";
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Alert
  const [alert, setAlert] = React.useState<{ type: "success" | "destructive"; message: string } | null>(null);
  const showAlert = (message: string, type: "success" | "destructive" = "success") => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleOpenJobModal = (job?: CareerJobRecord) => {
    if (job) {
      setEditingJob(job);
      setReqsEnInput(job.requirementsEn.join("\n"));
      setReqsArInput(job.requirementsAr.join("\n"));
      setRespsEnInput(job.responsibilitiesEn.join("\n"));
      setRespsArInput(job.responsibilitiesAr.join("\n"));
    } else {
      const newJob: CareerJobRecord = {
        id: `job-${Date.now()}`,
        slug: "",
        titleEn: "",
        titleAr: "",
        department: "engineering",
        workMode: "remote",
        workTypeEn: "Full-time",
        workTypeAr: "دوام كامل",
        locationEn: "Riyadh / Remote",
        locationAr: "الرياض / عن بُعد",
        descriptionEn: "",
        descriptionAr: "",
        requirementsEn: [],
        requirementsAr: [],
        responsibilitiesEn: [],
        responsibilitiesAr: [],
        displayOrder: jobs.length + 1,
        isActive: true,
      };
      setEditingJob(newJob);
      setReqsEnInput("");
      setReqsArInput("");
      setRespsEnInput("");
      setRespsArInput("");
    }
    setJobModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    const reqsEn = reqsEnInput.split("\n").map((s) => s.trim()).filter(Boolean);
    const reqsAr = reqsArInput.split("\n").map((s) => s.trim()).filter(Boolean);
    const respsEn = respsEnInput.split("\n").map((s) => s.trim()).filter(Boolean);
    const respsAr = respsArInput.split("\n").map((s) => s.trim()).filter(Boolean);

    const payload: CareerJobRecord = {
      ...editingJob,
      slug: editingJob.slug || editingJob.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      requirementsEn: reqsEn,
      requirementsAr: reqsAr,
      responsibilitiesEn: respsEn,
      responsibilitiesAr: respsAr,
    };

    try {
      await upsertCareerJobAction(payload);
      setJobs((prev) => {
        const idx = prev.findIndex((j) => j.id === payload.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = payload;
          return next;
        }
        return [...prev, payload];
      });
      setJobModalOpen(false);
      showAlert(isAr ? "تم حفظ الوظيفة بنجاح" : "Job saved successfully.");
    } catch {
      showAlert(isAr ? "فشل حفظ الوظيفة" : "Failed to save job.", "destructive");
    }
  };

  const handleToggleJobActive = async (job: CareerJobRecord) => {
    const updated = { ...job, isActive: !job.isActive };
    try {
      await upsertCareerJobAction(updated);
      setJobs((prev) => prev.map((j) => (j.id === job.id ? updated : j)));
      showAlert(
        isAr
          ? updated.isActive ? "تم تفعيل الوظيفة" : "تم تعطيل الوظيفة"
          : updated.isActive ? "Job activated" : "Job deactivated"
      );
    } catch {
      showAlert(isAr ? "فشل تعديل حالة الوظيفة" : "Failed to update job status", "destructive");
    }
  };

  const handleSaveValue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingValue) return;

    try {
      await upsertCareerValueAction(editingValue);
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

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === "job") {
        await deleteCareerJobAction(deleteTarget.id);
        setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
      } else {
        await deleteCareerValueAction(deleteTarget.id);
        setValues((prev) => prev.filter((v) => v.id !== deleteTarget.id));
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <LuBriefcase className="w-6 h-6 text-primary" />
            <span>{isAr ? "إدارة التوظيف والوظائف" : "Careers & Positions CMS"}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {isAr
              ? "نشر وتعديل الشواغر الهندسية، المتطلبات، المسؤوليات، وثقافة العمل."
              : "Post and manage engineering openings, requirements, responsibilities, and team values."}
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
          variant={activeTab === "jobs" ? "primary" : "outline"}
          size="sm"
          onClick={() => setActiveTab("jobs")}
          className="gap-2 text-xs"
        >
          <LuBriefcase className="w-4 h-4" />
          <span>{isAr ? "الشواغر والوظائف المتاحة" : "Open Positions"}</span>
          <Badge variant="secondary" className="ms-1 px-1.5 py-0 text-[10px]">
            {jobs.length}
          </Badge>
        </Button>
        <Button
          variant={activeTab === "values" ? "primary" : "outline"}
          size="sm"
          onClick={() => setActiveTab("values")}
          className="gap-2 text-xs"
        >
          <LuAward className="w-4 h-4" />
          <span>{isAr ? "قيم التوظيف وبيئة العمل" : "Career Values"}</span>
          <Badge variant="secondary" className="ms-1 px-1.5 py-0 text-[10px]">
            {values.length}
          </Badge>
        </Button>
      </div>

      {activeTab === "jobs" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              {isAr ? "إجمالي الوظائف المدرجة في الموقع" : "All job listings displayed on the careers page"}
            </p>
            <Button size="sm" variant="primary" className="gap-2 text-xs" onClick={() => handleOpenJobModal()}>
              <LuPlus className="w-4 h-4" />
              <span>{isAr ? "إضافة وظيفة جديدة" : "Add Job Position"}</span>
            </Button>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => (
              <Card key={job.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm sm:text-base text-foreground">
                      {isAr ? job.titleAr || job.titleEn : job.titleEn}
                    </span>
                    <Badge variant="outline" className="text-[11px] uppercase font-mono">
                      {job.department}
                    </Badge>
                    <Badge variant="secondary" className="text-[11px]">
                      {job.workMode}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                      <LuMapPin className="w-3 h-3" />
                      {isAr ? job.locationAr : job.locationEn}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 max-w-2xl">
                    {isAr ? job.descriptionAr || job.descriptionEn : job.descriptionEn}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">{job.isActive ? (isAr ? "مفعل" : "Active") : (isAr ? "معطل" : "Inactive")}</span>
                    <Switch checked={job.isActive} onChange={() => handleToggleJobActive(job)} />
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 text-xs"
                    onClick={() => handleOpenJobModal(job)}
                  >
                    <LuPencil className="w-3.5 h-3.5" />
                    <span>{isAr ? "تعديل" : "Edit"}</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteTarget({ type: "job", id: job.id, name: job.titleEn })}
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

      {activeTab === "values" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              {isAr ? "قيم التوظيف وثقافة الفريق" : "Team culture and hiring values"}
            </p>
            <Button
              size="sm"
              variant="primary"
              className="gap-2 text-xs"
              onClick={() => {
                setEditingValue({
                  id: `cval-${Date.now()}`,
                  titleEn: "",
                  titleAr: "",
                  descriptionEn: "",
                  descriptionAr: "",
                  icon: "LuAward",
                  displayOrder: values.length + 1,
                  isActive: true,
                });
                setValueModalOpen(true);
              }}
            >
              <LuPlus className="w-4 h-4" />
              <span>{isAr ? "إضافة قيمة جديدة" : "Add Career Value"}</span>
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

      {/* Job Modal */}
      {jobModalOpen && editingJob && (
        <Dialog open={jobModalOpen} onOpenChange={setJobModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSaveJob}>
              <DialogHeader>
                <DialogTitle>{isAr ? "تعديل الوظيفة" : "Edit Job Opening"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Title (EN)</label>
                    <Input
                      value={editingJob.titleEn}
                      onChange={(e) => setEditingJob({ ...editingJob, titleEn: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">العنوان (عربي)</label>
                    <Input
                      dir="rtl"
                      value={editingJob.titleAr}
                      onChange={(e) => setEditingJob({ ...editingJob, titleAr: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Slug</label>
                    <Input
                      value={editingJob.slug}
                      onChange={(e) => setEditingJob({ ...editingJob, slug: e.target.value })}
                      placeholder="senior-backend-engineer"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Department</label>
                    <select
                      className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs"
                      value={editingJob.department}
                      onChange={(e) => setEditingJob({ ...editingJob, department: e.target.value as JobDepartment })}
                    >
                      <option value="engineering">Engineering</option>
                      <option value="ai">AI</option>
                      <option value="design">Design</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Work Mode</label>
                    <select
                      className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs"
                      value={editingJob.workMode}
                      onChange={(e) => setEditingJob({ ...editingJob, workMode: e.target.value as JobWorkMode })}
                    >
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="onSite">On-site</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Location (EN)</label>
                    <Input
                      value={editingJob.locationEn}
                      onChange={(e) => setEditingJob({ ...editingJob, locationEn: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">الموقع (عربي)</label>
                    <Input
                      dir="rtl"
                      value={editingJob.locationAr}
                      onChange={(e) => setEditingJob({ ...editingJob, locationAr: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Description (EN)</label>
                  <Textarea
                    rows={3}
                    value={editingJob.descriptionEn}
                    onChange={(e) => setEditingJob({ ...editingJob, descriptionEn: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">الوصف (عربي)</label>
                  <Textarea
                    dir="rtl"
                    rows={3}
                    value={editingJob.descriptionAr}
                    onChange={(e) => setEditingJob({ ...editingJob, descriptionAr: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Requirements (EN, one per line)</label>
                    <Textarea
                      rows={4}
                      value={reqsEnInput}
                      onChange={(e) => setReqsEnInput(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">المتطلبات (عربي، سطر لكل شرط)</label>
                    <Textarea
                      dir="rtl"
                      rows={4}
                      value={reqsArInput}
                      onChange={(e) => setReqsArInput(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Responsibilities (EN, one per line)</label>
                    <Textarea
                      rows={4}
                      value={respsEnInput}
                      onChange={(e) => setRespsEnInput(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">المسؤوليات (عربي، سطر لكل مهمة)</label>
                    <Textarea
                      dir="rtl"
                      rows={4}
                      value={respsArInput}
                      onChange={(e) => setRespsArInput(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setJobModalOpen(false)}>
                  {isAr ? "إلغاء" : "Cancel"}
                </Button>
                <Button type="submit" variant="primary">
                  {isAr ? "حفظ الوظيفة" : "Save Job"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Career Value Modal */}
      {valueModalOpen && editingValue && (
        <Dialog open={valueModalOpen} onOpenChange={setValueModalOpen}>
          <DialogContent className="max-w-lg">
            <form onSubmit={handleSaveValue}>
              <DialogHeader>
                <DialogTitle>{isAr ? "تعديل قيمة التوظيف" : "Edit Career Value"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 text-xs">
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

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          open={Boolean(deleteTarget)}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title={isAr ? "تأكيد الحذف" : "Confirm Deletion"}
          description={
            isAr
              ? `هل أنت متأكد من حذف "${deleteTarget.name}"؟`
              : `Are you sure you want to delete "${deleteTarget.name}"?`
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
