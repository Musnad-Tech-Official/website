"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TechIcon } from "@/components/hero/tech-icon";
import {
  toggleTechnologyHomeAction,
  addTechnologyAction,
  deleteTechnologyAction,
} from "@/lib/technologies/actions";
import type { ManagedTechnology } from "@/lib/technologies/types";
import {
  LuSearch,
  LuPlus,
  LuCheck,
  LuTrash2,
  LuX,
  LuCpu,
  LuSparkles,
  LuLoader,
} from "react-icons/lu";
import { cn } from "@/lib/utils";

interface TechnologiesClientProps {
  initialTechnologies: ManagedTechnology[];
  locale: string;
}

const CATEGORIES = [
  "All",
  "Frontend",
  "Backend",
  "Database",
  "DevOps & Cloud",
  "Mobile & Desktop",
  "AI & Realtime",
] as const;

export function TechnologiesClient({
  initialTechnologies,
  locale,
}: TechnologiesClientProps) {
  const isRtl = locale === "ar";
  const [technologies, setTechnologies] = React.useState<ManagedTechnology[]>(initialTechnologies);
  const [search, setSearch] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  // New Tech Form
  const [newName, setNewName] = React.useState("");
  const [newCategory, setNewCategory] = React.useState<ManagedTechnology["category"]>("Frontend");
  const [newEnabledHome, setNewEnabledHome] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [togglingId, setTogglingId] = React.useState<string | null>(null);

  const filteredTechs = React.useMemo(() => {
    return technologies.filter((tech) => {
      const matchesSearch =
        !search ||
        tech.name.toLowerCase().includes(search.toLowerCase()) ||
        tech.id.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCategory === "All" || tech.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [technologies, search, activeCategory]);

  const totalCount = technologies.length;
  const homeCount = technologies.filter((t) => t.enabledHome).length;

  const handleToggleHome = async (id: string, current: boolean) => {
    setTogglingId(id);
    const nextVal = !current;

    // Optimistic UI update
    setTechnologies((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabledHome: nextVal } : t))
    );

    const res = await toggleTechnologyHomeAction(id, nextVal);
    if (!res.success) {
      // Revert if error
      setTechnologies((prev) =>
        prev.map((t) => (t.id === id ? { ...t, enabledHome: current } : t))
      );
    }
    setTogglingId(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsSubmitting(true);
    const res = await addTechnologyAction({
      name: newName.trim(),
      category: newCategory,
      enabledHome: newEnabledHome,
    });

    if (res.success && res.data) {
      setTechnologies((prev) => [...prev, res.data!]);
      setNewName("");
      setIsAddModalOpen(false);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRtl ? "هل أنت متأكد من حذف هذه التقنية؟" : "Are you sure you want to delete this technology?")) return;

    setTechnologies((prev) => prev.filter((t) => t.id !== id));
    await deleteTechnologyAction(id);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <LuCpu className="w-6 h-6 text-primary" />
            <span>{isRtl ? "التقنيات البرمجية والبنية التحتية" : "Technologies & Infrastructure"}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isRtl
              ? "إدارة حزمة التقنيات المعتمدة لمسند، والتحكم بالتقنيات المعروضة في الصفحة الرئيسية والمشاريع."
              : "Manage Musnad's official technology stack, choose what appears on the Home Page, and power the project picker."}
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="gap-1.5 shadow-sm shrink-0 cursor-pointer"
        >
          <LuPlus className="w-4 h-4" />
          <span>{isRtl ? "إضافة تقنية جديدة" : "Add Technology"}</span>
        </Button>
      </div>

      {/* 2. Key Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border border-border/70 bg-card">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            {isRtl ? "إجمالي التقنيات" : "Total Technologies"}
          </span>
          <span className="text-2xl font-black text-foreground mt-1 block font-mono">
            {totalCount}
          </span>
        </Card>

        <Card className="p-4 border border-border/70 bg-card">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block flex items-center gap-1.5">
            <LuSparkles className="w-3.5 h-3.5 text-primary" />
            <span>{isRtl ? "معروضة بالصفحة الرئيسية" : "Active on Home Page"}</span>
          </span>
          <span className="text-2xl font-black text-primary mt-1 block font-mono">
            {homeCount}
          </span>
        </Card>

        <Card className="p-4 border border-border/70 bg-card">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            {isRtl ? "التصنيفات المعتمدة" : "Active Categories"}
          </span>
          <span className="text-2xl font-black text-foreground mt-1 block font-mono">
            {CATEGORIES.length - 1}
          </span>
        </Card>
      </div>

      {/* 3. Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <LuSearch className="absolute start-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isRtl ? "ابحث في التقنيات..." : "Search tech stack..."}
            className="text-xs h-9 ps-9 rounded-xl"
          />
        </div>
      </div>

      {/* 4. Technologies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filteredTechs.map((tech) => (
          <div
            key={tech.id}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-border/70 bg-card hover:border-primary/40 transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center shrink-0 border border-border/50 text-foreground group-hover:scale-105 transition-transform">
                <TechIcon id={tech.id} className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-sm text-foreground block truncate">
                  {tech.name}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground block truncate">
                  {tech.category}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Home Page Toggle Switch */}
              <button
                type="button"
                onClick={() => handleToggleHome(tech.id, tech.enabledHome)}
                disabled={togglingId === tech.id}
                title={tech.enabledHome ? "Shown on Home Page (click to hide)" : "Hidden from Home (click to show)"}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  tech.enabledHome ? "bg-primary" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                    tech.enabledHome ? "translate-x-5 rtl:-translate-x-5" : "translate-x-0"
                  )}
                />
              </button>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => handleDelete(tech.id)}
                className="text-muted-foreground/60 hover:text-destructive p-1 rounded-md transition-colors"
                title={isRtl ? "حذف" : "Delete"}
              >
                <LuTrash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredTechs.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-border/70 rounded-2xl">
            <LuCpu className="w-8 h-8 text-muted-foreground/60 mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">
              {isRtl ? "لا توجد أي تقنيات مطابقة" : "No technologies match your filter"}
            </p>
          </div>
        )}
      </div>

      {/* 5. Add Technology Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 end-4 text-muted-foreground hover:text-foreground p-1 rounded-md"
            >
              <LuX className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <LuPlus className="w-4 h-4 text-primary" />
              <span>{isRtl ? "إضافة تقنية جديدة" : "Add New Technology"}</span>
            </h2>

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  {isRtl ? "اسم التقنية" : "Technology Name"}
                </label>
                <Input
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Svelte, Kafka, Snowflake, Flutter"
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  {isRtl ? "التصنيف" : "Category"}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ManagedTechnology["category"])}
                  className="w-full h-9 px-3 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="enabledHomeCheck"
                  checked={newEnabledHome}
                  onChange={(e) => setNewEnabledHome(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="enabledHomeCheck" className="text-xs text-foreground font-medium cursor-pointer">
                  {isRtl ? "عرض في الصفحة الرئيسية مباشرة" : "Display on Home Page showcase"}
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs h-8"
                >
                  {isRtl ? "إلغاء" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmitting || !newName.trim()}
                  className="text-xs h-8 gap-1.5"
                >
                  {isSubmitting ? <LuLoader className="w-3.5 h-3.5 animate-spin" /> : <LuCheck className="w-3.5 h-3.5" />}
                  <span>{isRtl ? "إضافة" : "Add to Catalog"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
