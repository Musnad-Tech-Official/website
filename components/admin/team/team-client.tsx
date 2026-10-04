"use client";

import * as React from "react";
import {
  LuPlus,
  LuSearch,
  LuUsers,
  LuUserCheck,
  LuUserX,
  LuLayers,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { TeamTable } from "./team-table";
import { TeamEditorModal } from "./team-editor-modal";
import type { TeamMember, TeamMemberFormData } from "@/lib/team/types";
import {
  saveTeamMemberAction,
  deleteTeamMemberAction,
  toggleTeamMemberActiveAction,
} from "@/lib/team/actions";

interface TeamClientProps {
  initialMembers: TeamMember[];
  locale: string;
}

export function TeamClient({ initialMembers, locale }: TeamClientProps) {
  const isRtl = locale === "ar";
  const [members, setMembers] = React.useState<TeamMember[]>(initialMembers);
  const [search, setSearch] = React.useState("");
  const [departmentFilter, setDepartmentFilter] = React.useState("all");

  const [editingMember, setEditingMember] = React.useState<TeamMember | null>(null);
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [alertNotification, setAlertNotification] = React.useState<{
    type: "success" | "destructive" | "warning";
    message: string;
  } | null>(null);

  const showAlert = (
    message: string,
    type: "success" | "destructive" | "warning" = "success"
  ) => {
    setAlertNotification({ type, message });
    setTimeout(() => setAlertNotification(null), 4000);
  };

  // Distinct departments
  const departments = React.useMemo(() => {
    const list = members.map((m) => m.department).filter(Boolean);
    return Array.from(new Set(list));
  }, [members]);

  // Filtered members list
  const filteredMembers = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((member) => {
      const matchSearch =
        q === "" ||
        member.nameEn.toLowerCase().includes(q) ||
        member.nameAr.includes(q) ||
        member.roleEn.toLowerCase().includes(q) ||
        member.roleAr.includes(q) ||
        member.slug.toLowerCase().includes(q) ||
        member.skills.some((s) => s.toLowerCase().includes(q));

      const matchDept =
        departmentFilter === "all" || member.department === departmentFilter;

      return matchSearch && matchDept;
    });
  }, [members, search, departmentFilter]);

  // Statistics
  const stats = React.useMemo(() => {
    return {
      total: members.length,
      active: members.filter((m) => m.isActive).length,
      hidden: members.filter((m) => !m.isActive).length,
      departmentsCount: departments.length,
    };
  }, [members, departments]);

  const handleOpenNew = () => {
    setEditingMember(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsEditorOpen(true);
  };

  const handleSaveMember = async (formData: TeamMemberFormData): Promise<boolean> => {
    try {
      const res = await saveTeamMemberAction(formData);
      if (res.success && res.member) {
        // Update local state
        setMembers((prev) => {
          const index = prev.findIndex((m) => m.id === res.member?.id);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = res.member!;
            return updated.sort((a, b) => a.displayOrder - b.displayOrder);
          } else {
            return [...prev, res.member!].sort(
              (a, b) => a.displayOrder - b.displayOrder
            );
          }
        });

        showAlert(
          formData.id
            ? isRtl
              ? "تم تحديث بيانات العضو بنجاح."
              : "Team member updated successfully."
            : isRtl
            ? "تمت إضافة عضو الفريق بنجاح."
            : "Team member created successfully.",
          "success"
        );
        return true;
      } else {
        showAlert(res.error || "Failed to save team member.", "destructive");
        return false;
      }
    } catch (err: unknown) {
      showAlert((err as Error).message || "An unexpected error occurred.", "destructive");
      return false;
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const res = await deleteTeamMemberAction(id);
      if (res.success) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        showAlert(
          isRtl ? "تم حذف العضو من قاعدة البيانات." : "Member deleted successfully.",
          "success"
        );
      } else {
        showAlert(res.error || "Failed to delete team member.", "destructive");
      }
    } catch (err: unknown) {
      showAlert((err as Error).message || "An error occurred while deleting.", "destructive");
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      // Optimistic update
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isActive } : m))
      );

      const res = await toggleTeamMemberActiveAction(id, isActive);
      if (res.success) {
        showAlert(
          isActive
            ? isRtl
              ? "تم تنشيط ظهور العضو في الموقع."
              : "Member is now active on public site."
            : isRtl
            ? "تم إخفاء العضو من الموقع العام."
            : "Member hidden from public site.",
          "success"
        );
      } else {
        // Revert
        setMembers((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isActive: !isActive } : m))
        );
        showAlert(res.error || "Failed to toggle status.", "destructive");
      }
    } catch {
      // Revert on exception
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isActive: !isActive } : m))
      );
      showAlert("Network error updating status.", "destructive");
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Notification */}
      {alertNotification && (
        <Alert
          variant={alertNotification.type}
          onClose={() => setAlertNotification(null)}
        >
          <AlertTitle>
            {alertNotification.type === "success"
              ? isRtl
                ? "عملية ناجحة"
                : "Success"
              : isRtl
              ? "تنبيه"
              : "Notice"}
          </AlertTitle>
          <AlertDescription>{alertNotification.message}</AlertDescription>
        </Alert>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">{isRtl ? "إجمالي الفريق" : "Total Members"}</span>
            <LuUsers className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-foreground">
            {stats.total}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">{isRtl ? "نشط بالموقع" : "Active Public"}</span>
            <LuUserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-foreground">
            {stats.active}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">{isRtl ? "غير نشط / مسودة" : "Hidden / Inactive"}</span>
            <LuUserX className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-foreground">
            {stats.hidden}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">{isRtl ? "الأقسام" : "Departments"}</span>
            <LuLayers className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-foreground">
            {stats.departmentsCount}
          </div>
        </div>
      </div>

      {/* Filters & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-card border border-border shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-2xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <LuSearch className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                isRtl
                  ? "بحث بالاسم، المسمى، المهارات أو الرابط..."
                  : "Search by name, role, skills, or slug..."
              }
              className="ps-9 h-9.5 text-xs rounded-xl"
            />
          </div>

          {/* Department Select */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="h-9.5 px-3 bg-muted/40 border border-border/80 rounded-xl text-xs text-foreground cursor-pointer focus:outline-none min-w-[140px]"
          >
            <option value="all">{isRtl ? "جميع الأقسام" : "All Departments"}</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Add Member Button */}
        <Button
          onClick={handleOpenNew}
          className="gap-2 rounded-xl text-xs font-semibold cursor-pointer h-9.5 px-4 bg-primary text-primary-foreground shadow-2xs shrink-0"
        >
          <LuPlus className="w-4 h-4" />
          <span>{isRtl ? "إضافة عضو جديد" : "Add Team Member"}</span>
        </Button>
      </div>

      {/* Team Table */}
      <TeamTable
        members={filteredMembers}
        locale={locale}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteMember}
        onToggleActive={handleToggleActive}
      />

      {/* Team Member Editor Modal */}
      <TeamEditorModal
        member={editingMember}
        locale={locale}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveMember}
      />
    </div>
  );
}
