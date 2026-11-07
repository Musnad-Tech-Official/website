"use client";

import * as React from "react";
import {
  LuCircleHelp,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuSearch,
  LuFolder,
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
import type { FaqTopicRecord, FaqQuestionRecord } from "@/lib/faqs/types";
import {
  upsertFaqTopicAction,
  deleteFaqTopicAction,
  upsertFaqQuestionAction,
  deleteFaqQuestionAction,
} from "@/lib/faqs/actions";

interface FaqsClientProps {
  initialTopics: FaqTopicRecord[];
  initialQuestions: FaqQuestionRecord[];
  locale: string;
}

export function FaqsClient({ initialTopics, initialQuestions, locale }: FaqsClientProps) {
  const isAr = locale === "ar";
  const [activeTab, setActiveTab] = React.useState<"questions" | "topics">("questions");

  const [topics, setTopics] = React.useState<FaqTopicRecord[]>(initialTopics);
  const [questions, setQuestions] = React.useState<FaqQuestionRecord[]>(initialQuestions);

  // Filters
  const [selectedTopic, setSelectedTopic] = React.useState<string>("all");
  const [search, setSearch] = React.useState<string>("");

  // Question Modal
  const [questionModalOpen, setQuestionModalOpen] = React.useState(false);
  const [editingQuestion, setEditingQuestion] = React.useState<FaqQuestionRecord | null>(null);

  // Topic Modal
  const [topicModalOpen, setTopicModalOpen] = React.useState(false);
  const [editingTopic, setEditingTopic] = React.useState<FaqTopicRecord | null>(null);

  // Delete Target
  const [deleteTarget, setDeleteTarget] = React.useState<{
    type: "question" | "topic";
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

  const filteredQuestions = React.useMemo(() => {
    return questions.filter((q) => {
      const matchTopic = selectedTopic === "all" || q.topicId === selectedTopic;
      const qLower = search.toLowerCase();
      const matchSearch =
        !search.trim() ||
        q.questionEn.toLowerCase().includes(qLower) ||
        q.questionAr.includes(search) ||
        q.answerEn.toLowerCase().includes(qLower) ||
        q.answerAr.includes(search);
      return matchTopic && matchSearch;
    });
  }, [questions, selectedTopic, search]);

  const handleOpenQuestionModal = (item?: FaqQuestionRecord) => {
    if (item) {
      setEditingQuestion(item);
    } else {
      const defaultTopic = topics[0]?.id || "working-with-us";
      setEditingQuestion({
        id: `q-${Date.now()}`,
        topicId: selectedTopic !== "all" ? selectedTopic : defaultTopic,
        questionEn: "",
        questionAr: "",
        answerEn: "",
        answerAr: "",
        displayOrder: questions.length + 1,
        isActive: true,
      });
    }
    setQuestionModalOpen(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    try {
      await upsertFaqQuestionAction(editingQuestion);
      setQuestions((prev) => {
        const idx = prev.findIndex((q) => q.id === editingQuestion.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = editingQuestion;
          return next;
        }
        return [...prev, editingQuestion];
      });
      setQuestionModalOpen(false);
      showAlert(isAr ? "تم حفظ السؤال بنجاح" : "Question saved successfully.");
    } catch {
      showAlert(isAr ? "فشل حفظ السؤال" : "Failed to save question.", "destructive");
    }
  };

  const handleToggleQuestionActive = async (q: FaqQuestionRecord) => {
    const updated = { ...q, isActive: !q.isActive };
    try {
      await upsertFaqQuestionAction(updated);
      setQuestions((prev) => prev.map((item) => (item.id === q.id ? updated : item)));
      showAlert(isAr ? "تم تحديث حالة السؤال" : "Question status updated.");
    } catch {
      showAlert(isAr ? "فشل تحديث الحالة" : "Failed to update status.", "destructive");
    }
  };

  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTopic) return;

    try {
      await upsertFaqTopicAction(editingTopic);
      setTopics((prev) => {
        const idx = prev.findIndex((t) => t.id === editingTopic.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = editingTopic;
          return next;
        }
        return [...prev, editingTopic];
      });
      setTopicModalOpen(false);
      showAlert(isAr ? "تم حفظ التصنيف بنجاح" : "Topic saved successfully.");
    } catch {
      showAlert(isAr ? "فشل حفظ التصنيف" : "Failed to save topic.", "destructive");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === "question") {
        await deleteFaqQuestionAction(deleteTarget.id);
        setQuestions((prev) => prev.filter((q) => q.id !== deleteTarget.id));
      } else {
        await deleteFaqTopicAction(deleteTarget.id);
        setTopics((prev) => prev.filter((t) => t.id !== deleteTarget.id));
        setQuestions((prev) => prev.filter((q) => q.topicId !== deleteTarget.id));
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
            <LuCircleHelp className="w-6 h-6 text-primary" />
            <span>{isAr ? "إدارة الأسئلة الشائعة" : "FAQs CMS"}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {isAr
              ? "التحكم في تصنيفات وأسئلة وإجابات صفحة الأسئلة الشائعة بصورة ثنائية اللغة."
              : "Manage frequently asked questions, answers, and categorization with bilingual support."}
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
          variant={activeTab === "questions" ? "primary" : "outline"}
          size="sm"
          onClick={() => setActiveTab("questions")}
          className="gap-2 text-xs"
        >
          <LuCircleHelp className="w-4 h-4" />
          <span>{isAr ? "الأسئلة والإجابات" : "Questions & Answers"}</span>
          <Badge variant="secondary" className="ms-1 px-1.5 py-0 text-[10px]">
            {questions.length}
          </Badge>
        </Button>
        <Button
          variant={activeTab === "topics" ? "primary" : "outline"}
          size="sm"
          onClick={() => setActiveTab("topics")}
          className="gap-2 text-xs"
        >
          <LuFolder className="w-4 h-4" />
          <span>{isAr ? "تصنيفات ومحاور الأسئلة" : "Topics & Categories"}</span>
          <Badge variant="secondary" className="ms-1 px-1.5 py-0 text-[10px]">
            {topics.length}
          </Badge>
        </Button>
      </div>

      {activeTab === "questions" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
              <div className="relative flex-1 min-w-[200px]">
                <LuSearch className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="ps-9 h-9 text-xs"
                  placeholder={isAr ? "البحث في الأسئلة والإجابات..." : "Search questions or answers..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="h-9 rounded-md border border-border bg-background px-3 text-xs"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                <option value="all">{isAr ? "جميع التصنيفات" : "All Topics"}</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {isAr ? t.titleAr : t.titleEn}
                  </option>
                ))}
              </select>
            </div>

            <Button size="sm" variant="primary" className="gap-2 text-xs" onClick={() => handleOpenQuestionModal()}>
              <LuPlus className="w-4 h-4" />
              <span>{isAr ? "إضافة سؤال جديد" : "Add FAQ"}</span>
            </Button>
          </div>

          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const topic = topics.find((t) => t.id === q.topicId);
              return (
                <Card key={q.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[11px] font-mono">
                        {topic ? (isAr ? topic.titleAr : topic.titleEn) : q.topicId}
                      </Badge>
                      <span className="font-bold text-sm sm:text-base text-foreground">
                        {isAr ? q.questionAr || q.questionEn : q.questionEn}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 max-w-2xl leading-relaxed">
                      {isAr ? q.answerAr || q.answerEn : q.answerEn}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">{q.isActive ? (isAr ? "مفعل" : "Active") : (isAr ? "معطل" : "Inactive")}</span>
                      <Switch checked={q.isActive} onChange={() => handleToggleQuestionActive(q)} />
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5 text-xs"
                      onClick={() => handleOpenQuestionModal(q)}
                    >
                      <LuPencil className="w-3.5 h-3.5" />
                      <span>{isAr ? "تعديل" : "Edit"}</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteTarget({ type: "question", id: q.id, name: q.questionEn })}
                    >
                      <LuTrash2 className="w-3.5 h-3.5" />
                      <span>{isAr ? "حذف" : "Delete"}</span>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "topics" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              {isAr ? "المجموعات الرئيسية للأسئلة الشائعة" : "Main topics organizing the FAQs"}
            </p>
            <Button
              size="sm"
              variant="primary"
              className="gap-2 text-xs"
              onClick={() => {
                setEditingTopic({
                  id: `topic-${Date.now()}`,
                  slug: "",
                  titleEn: "",
                  titleAr: "",
                  displayOrder: topics.length + 1,
                  isActive: true,
                });
                setTopicModalOpen(true);
              }}
            >
              <LuPlus className="w-4 h-4" />
              <span>{isAr ? "إضافة تصنيف جديد" : "Add Topic"}</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((t) => {
              const count = questions.filter((q) => q.topicId === t.id).length;
              return (
                <Card key={t.id} className="p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        #{t.displayOrder} • {t.slug}
                      </span>
                      <Badge variant="secondary" className="text-[11px]">
                        {count} {isAr ? "أسئلة" : "questions"}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-base text-foreground">
                      {isAr ? t.titleAr || t.titleEn : t.titleEn}
                    </h3>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5 text-xs"
                      onClick={() => {
                        setEditingTopic(t);
                        setTopicModalOpen(true);
                      }}
                    >
                      <LuPencil className="w-3.5 h-3.5" />
                      <span>{isAr ? "تعديل" : "Edit"}</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteTarget({ type: "topic", id: t.id, name: t.titleEn })}
                    >
                      <LuTrash2 className="w-3.5 h-3.5" />
                      <span>{isAr ? "حذف" : "Delete"}</span>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Question Modal */}
      {questionModalOpen && editingQuestion && (
        <Dialog open={questionModalOpen} onOpenChange={setQuestionModalOpen}>
          <DialogContent className="max-w-xl">
            <form onSubmit={handleSaveQuestion}>
              <DialogHeader>
                <DialogTitle>{isAr ? "تعديل السؤال" : "Edit FAQ Item"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Topic</label>
                    <select
                      className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs"
                      value={editingQuestion.topicId}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, topicId: e.target.value })}
                    >
                      {topics.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.titleEn} ({t.titleAr})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Display Order</label>
                    <Input
                      type="number"
                      value={editingQuestion.displayOrder}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, displayOrder: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Question (EN)</label>
                  <Input
                    value={editingQuestion.questionEn}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, questionEn: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">السؤال (عربي)</label>
                  <Input
                    dir="rtl"
                    value={editingQuestion.questionAr}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, questionAr: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Answer (EN)</label>
                  <Textarea
                    rows={4}
                    value={editingQuestion.answerEn}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, answerEn: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">الإجابة (عربي)</label>
                  <Textarea
                    dir="rtl"
                    rows={4}
                    value={editingQuestion.answerAr}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, answerAr: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setQuestionModalOpen(false)}>
                  {isAr ? "إلغاء" : "Cancel"}
                </Button>
                <Button type="submit" variant="primary">
                  {isAr ? "حفظ السؤال" : "Save Question"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Topic Modal */}
      {topicModalOpen && editingTopic && (
        <Dialog open={topicModalOpen} onOpenChange={setTopicModalOpen}>
          <DialogContent className="max-w-md">
            <form onSubmit={handleSaveTopic}>
              <DialogHeader>
                <DialogTitle>{isAr ? "تعديل تصنيف الأسئلة" : "Edit Topic"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Slug</label>
                  <Input
                    value={editingTopic.slug}
                    onChange={(e) => setEditingTopic({ ...editingTopic, slug: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Title (EN)</label>
                  <Input
                    value={editingTopic.titleEn}
                    onChange={(e) => setEditingTopic({ ...editingTopic, titleEn: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">العنوان (عربي)</label>
                  <Input
                    dir="rtl"
                    value={editingTopic.titleAr}
                    onChange={(e) => setEditingTopic({ ...editingTopic, titleAr: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Display Order</label>
                  <Input
                    type="number"
                    value={editingTopic.displayOrder}
                    onChange={(e) => setEditingTopic({ ...editingTopic, displayOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setTopicModalOpen(false)}>
                  {isAr ? "إلغاء" : "Cancel"}
                </Button>
                <Button type="submit" variant="primary">
                  {isAr ? "حفظ التصنيف" : "Save Topic"}
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
