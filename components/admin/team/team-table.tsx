/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import {
  LuPencil,
  LuTrash2,
  LuExternalLink,
  LuEye,
  LuEyeOff,
  LuUsers,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { TeamMember } from "@/lib/team/types";

interface TeamTableProps {
  members: TeamMember[];
  locale: string;
  onEdit: (member: TeamMember) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
}

export function TeamTable({
  members,
  locale,
  onEdit,
  onDelete,
  onToggleActive,
}: TeamTableProps) {
  const isRtl = locale === "ar";
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await onDelete(deleteId);
    setIsDeleting(false);
    setDeleteId(null);
  };

  if (members.length === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-border rounded-2xl bg-card">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary mb-3">
          <LuUsers className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          {isRtl ? "لا يوجد أعضاء بالفريق حالياً" : "No team members found"}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          {isRtl
            ? "قم بإضافة أعضاء الفريق لعرضهم في الصفحة العامة وربطهم بالمقالات والمشاريع."
            : "Add team members to display them on the public team page and link them as authors."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border border-border/80 rounded-2xl overflow-hidden bg-card shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                <th className="py-3 px-4 text-start font-medium">{isRtl ? "العضو" : "Member"}</th>
                <th className="py-3 px-4 text-start font-medium">{isRtl ? "المسمى والوظيفة" : "Role & Dept"}</th>
                <th className="py-3 px-4 text-start font-medium hidden md:table-cell">{isRtl ? "المهارات" : "Skills"}</th>
                <th className="py-3 px-4 text-center font-medium">{isRtl ? "الترتيب" : "Order"}</th>
                <th className="py-3 px-4 text-center font-medium">{isRtl ? "الحالة" : "Status"}</th>
                <th className="py-3 px-4 text-end font-medium">{isRtl ? "الإجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  {/* Member Name & Avatar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl overflow-hidden bg-muted/80 border border-border shrink-0 flex items-center justify-center font-bold text-xs text-foreground">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.nameEn}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span>{member.initials || "SA"}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-foreground text-sm flex items-center gap-1.5 truncate">
                          <span>{isRtl ? member.nameAr : member.nameEn}</span>
                          <span className="text-xs text-muted-foreground font-normal">
                            ({isRtl ? member.nameEn : member.nameAr})
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-muted-foreground/80 mt-0.5 truncate flex items-center gap-1">
                          <span>/team/{member.slug}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role & Department */}
                  <td className="py-3 px-4">
                    <div className="font-medium text-foreground">
                      {isRtl ? member.roleAr : member.roleEn}
                    </div>
                    <div className="mt-1">
                      <Badge variant="outline" size="sm" className="text-[10px] py-0 px-2">
                        {member.department}
                      </Badge>
                    </div>
                  </td>

                  {/* Skills */}
                  <td className="py-3 px-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {member.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-muted/60 text-muted-foreground border border-border/40"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{member.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Display Order */}
                  <td className="py-3 px-4 text-center font-mono text-xs font-semibold text-muted-foreground">
                    #{member.displayOrder}
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleActive(member.id, !member.isActive)}
                      className="cursor-pointer inline-flex items-center justify-center p-1 rounded-lg hover:bg-muted transition-colors"
                      title={member.isActive ? "Deactivate member" : "Activate member"}
                    >
                      {member.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <LuEye className="w-3 h-3" />
                          <span>{isRtl ? "نشط" : "Active"}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground border border-border">
                          <LuEyeOff className="w-3 h-3" />
                          <span>{isRtl ? "مخفي" : "Hidden"}</span>
                        </span>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/team/${member.slug}`}
                        target="_blank"
                        className="h-9 w-9 rounded-xl border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                        title={isRtl ? "زيارة الصفحة العامة" : "View Public Profile"}
                      >
                        <LuExternalLink className="w-4 h-4" />
                      </Link>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(member)}
                        className="h-9 w-9 p-0 rounded-xl cursor-pointer"
                        title={isRtl ? "تعديل" : "Edit"}
                      >
                        <LuPencil className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(member.id)}
                        className="h-9 w-9 p-0 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                        title={isRtl ? "حذف" : "Delete"}
                      >
                        <LuTrash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={isRtl ? "حذف عضو الفريق" : "Delete Team Member"}
        description={
          isRtl
            ? "هل أنت متأكد من رغبتك في حذف هذا العضو نهائياً من قاعدة البيانات؟ لا يمكن التراجع عن هذا الإجراء."
            : "Are you sure you want to permanently delete this team member? This action cannot be undone."
        }
        confirmLabel={isRtl ? "تأكيد الحذف" : "Confirm Delete"}
        cancelLabel={isRtl ? "إلغاء" : "Cancel"}
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
      />
    </>
  );
}
