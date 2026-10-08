"use client";

import * as React from "react";
import {
  LuUsers,
  LuShieldCheck,
  LuShieldAlert,
  LuSearch,
  LuUserCheck,
  LuUserX,
  LuMail,
  LuCalendar,
  LuClock,
  LuRefreshCw,
  LuCheck,
  LuShield,
  LuUser,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { AdminUser, AdminUserRole } from "@/lib/users/actions";
import {
  getUsersAction,
  updateUserRoleAction,
  toggleUserBanAction,
} from "@/lib/users/actions";

interface UsersClientProps {
  initialUsers: AdminUser[];
  locale: string;
}

export function UsersClient({ initialUsers, locale }: UsersClientProps) {
  const isAr = locale === "ar";
  const [users, setUsers] = React.useState<AdminUser[]>(initialUsers);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Role Edit Dialog State
  const [editingUser, setEditingUser] = React.useState<AdminUser | null>(null);
  const [selectedRole, setSelectedRole] = React.useState<AdminUserRole>("member");
  const [isSavingRole, setIsSavingRole] = React.useState(false);

  // Ban Confirm Dialog State
  const [banningUser, setBanningUser] = React.useState<AdminUser | null>(null);
  const [isTogglingBan, setIsTogglingBan] = React.useState(false);

  // Alert State
  const [alertInfo, setAlertInfo] = React.useState<{
    type: "success" | "destructive";
    message: string;
  } | null>(null);

  const showAlert = (message: string, type: "success" | "destructive" = "success") => {
    setAlertInfo({ type, message });
    setTimeout(() => setAlertInfo(null), 4500);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const fresh = await getUsersAction();
      setUsers(fresh);
      showAlert(isAr ? "تم تحديث قائمة المستخدمين بنجاح" : "User list refreshed successfully.");
    } catch {
      showAlert(
        isAr ? "فشل تحديث قائمة المستخدمين" : "Failed to refresh user list.",
        "destructive"
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenRoleModal = (user: AdminUser) => {
    setEditingUser(user);
    setSelectedRole(user.role);
  };

  const handleSaveRole = async () => {
    if (!editingUser) return;
    setIsSavingRole(true);
    try {
      await updateUserRoleAction(editingUser.id, selectedRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, role: selectedRole } : u))
      );
      showAlert(
        isAr
          ? `تم تحديث دور المستخدم ${editingUser.fullName} إلى ${selectedRole}`
          : `Updated role for ${editingUser.fullName} to ${selectedRole}.`
      );
      setEditingUser(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update role.";
      showAlert(msg, "destructive");
    } finally {
      setIsSavingRole(false);
    }
  };

  const handleConfirmBanToggle = async () => {
    if (!banningUser) return;
    setIsTogglingBan(true);
    const willBan = !banningUser.banned;
    try {
      await toggleUserBanAction(banningUser.id, willBan);
      setUsers((prev) =>
        prev.map((u) => (u.id === banningUser.id ? { ...u, banned: willBan } : u))
      );
      showAlert(
        willBan
          ? isAr
            ? `تم حظر حساب ${banningUser.fullName}`
            : `User ${banningUser.fullName} has been banned.`
          : isAr
          ? `تم إلغاء حظر حساب ${banningUser.fullName}`
          : `User ${banningUser.fullName} ban lifted.`
      );
      setBanningUser(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update ban status.";
      showAlert(msg, "destructive");
    } finally {
      setIsTogglingBan(false);
    }
  };

  // Filtered users
  const filteredUsers = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchSearch =
        q === "" ||
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);

      const matchRole =
        roleFilter === "all" ||
        (roleFilter === "banned" ? u.banned : u.role === roleFilter);

      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  // Statistics
  const stats = React.useMemo(() => {
    return {
      total: users.length,
      admins: users.filter((u) => u.role === "admin").length,
      team: users.filter((u) => u.role === "team").length,
      members: users.filter((u) => u.role === "member").length,
      banned: users.filter((u) => u.banned).length,
    };
  }, [users]);

  const formatDate = (timestamp?: number | null) => {
    if (!timestamp) return isAr ? "غير متوفر" : "Never";
    return new Date(timestamp).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Alert Notification */}
      {alertInfo && (
        <Alert variant={alertInfo.type} className="animate-in fade-in-50 duration-200">
          <AlertTitle className="font-semibold text-xs sm:text-sm">
            {alertInfo.type === "success"
              ? isAr
                ? "عملية ناجحة"
                : "Success"
              : isAr
              ? "تنبيه خطأ"
              : "Action Notice"}
          </AlertTitle>
          <AlertDescription className="text-xs">{alertInfo.message}</AlertDescription>
        </Alert>
      )}

      {/* Header and Telemetry Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <LuUsers className="w-6 h-6 text-primary" />
            {isAr ? "إدارة المستخدمين والصلاحيات" : "User Access & Roles"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAr
              ? "مراقبة حسابات المستخدمين النشطة، إدارة الرتب، والتحكم في صلاحيات النظام عبر Clerk."
              : "Monitor active accounts, assign administrative privileges, and manage roles."}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="rounded-xl gap-2 cursor-pointer self-start sm:self-auto"
        >
          <LuRefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isAr ? "تحديث القائمة" : "Refresh"}</span>
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 rounded-2xl bg-card border-border/70 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              {isAr ? "إجمالي الحسابات" : "Total Users"}
            </span>
            <LuUsers className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-extrabold mt-2 text-foreground font-mono">{stats.total}</p>
        </Card>

        <Card className="p-4 rounded-2xl bg-card border-border/70 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              {isAr ? "المسؤولون" : "Administrators"}
            </span>
            <LuShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-extrabold mt-2 text-primary font-mono">{stats.admins}</p>
        </Card>

        <Card className="p-4 rounded-2xl bg-card border-border/70 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              {isAr ? "فريق العمل" : "Team Members"}
            </span>
            <LuUserCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-extrabold mt-2 text-indigo-500 font-mono">{stats.team}</p>
        </Card>

        <Card className="p-4 rounded-2xl bg-card border-border/70 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              {isAr ? "المستخدمون" : "Members"}
            </span>
            <LuUser className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-extrabold mt-2 text-foreground font-mono">{stats.members}</p>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <LuSearch className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isAr
                ? "ابحث بالاسم، البريد الإلكتروني، أو المعرف..."
                : "Search by name, email, or user ID..."
            }
            className="ps-9 rounded-xl text-xs sm:text-sm"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "all", label: isAr ? "الكل" : "All" },
            { id: "admin", label: isAr ? "مسؤول" : "Admin" },
            { id: "team", label: isAr ? "فريق" : "Team" },
            { id: "member", label: isAr ? "عضو" : "Member" },
            { id: "banned", label: isAr ? "محظور" : "Banned" },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={roleFilter === tab.id ? "primary" : "outline"}
              size="sm"
              onClick={() => setRoleFilter(tab.id)}
              className="rounded-xl text-xs h-8 px-3 cursor-pointer shrink-0"
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Users Table / List */}
      <Card className="border-border/70 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground">
                <th className="py-3 px-4 text-start font-semibold">{isAr ? "المستخدم" : "User"}</th>
                <th className="py-3 px-4 text-start font-semibold">{isAr ? "الرتبة / الدور" : "Role"}</th>
                <th className="py-3 px-4 text-start font-semibold">{isAr ? "الحالة" : "Status"}</th>
                <th className="py-3 px-4 text-start font-semibold hidden md:table-cell">
                  {isAr ? "تاريخ الانضمام" : "Joined"}
                </th>
                <th className="py-3 px-4 text-start font-semibold hidden lg:table-cell">
                  {isAr ? "آخر تسجيل دخول" : "Last Active"}
                </th>
                <th className="py-3 px-4 text-end font-semibold">{isAr ? "الإجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <LuUsers className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">
                      {isAr ? "لم يتم العثور على أي مستخدمين" : "No users found"}
                    </p>
                    <p className="text-xs mt-1">
                      {isAr ? "جرب تغيير مصطلح البحث أو الفلتر" : "Try adjusting your search or filter."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleBadgeVariant =
                    user.role === "admin"
                      ? "accent"
                      : user.role === "team"
                      ? "default"
                      : "outline";

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-muted/20 transition-colors duration-150"
                    >
                      {/* User Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {user.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={user.imageUrl}
                              alt={user.fullName}
                              className="w-9 h-9 rounded-full object-cover border border-border/60 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center border border-primary/20 shrink-0 text-xs">
                              {user.fullName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-xs sm:text-sm truncate">
                              {user.fullName}
                            </p>
                            <p className="text-muted-foreground text-[11px] truncate flex items-center gap-1">
                              <LuMail className="w-3 h-3 shrink-0" />
                              <span>{user.email}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge variant={roleBadgeVariant} size="sm" className="capitalize font-mono">
                          {user.role === "admin" && <LuShieldCheck className="w-3 h-3 me-1" />}
                          {user.role}
                        </Badge>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {user.banned ? (
                          <Badge variant="destructive" size="sm">
                            {isAr ? "محظور" : "Banned"}
                          </Badge>
                        ) : (
                          <Badge variant="success" size="sm">
                            {isAr ? "نشط" : "Active"}
                          </Badge>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-muted-foreground text-[11px] hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <LuCalendar className="w-3 h-3" />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-muted-foreground text-[11px] hidden lg:table-cell">
                        <div className="flex items-center gap-1.5">
                          <LuClock className="w-3 h-3" />
                          <span>{formatDate(user.lastSignInAt)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-end whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenRoleModal(user)}
                            className="h-7 px-2.5 text-[11px] rounded-lg cursor-pointer"
                          >
                            <LuShield className="w-3 h-3 me-1 text-primary" />
                            {isAr ? "الدور" : "Role"}
                          </Button>

                          <Button
                            variant={user.banned ? "outline" : "ghost"}
                            size="sm"
                            onClick={() => setBanningUser(user)}
                            className={`h-7 px-2 text-[11px] rounded-lg cursor-pointer ${
                              user.banned
                                ? "text-emerald-500 hover:text-emerald-600"
                                : "text-muted-foreground hover:text-destructive"
                            }`}
                            title={
                              user.banned
                                ? isAr
                                  ? "إلغاء حظر الحساب"
                                  : "Unban user"
                                : isAr
                                ? "حظر الحساب"
                                : "Ban user"
                            }
                          >
                            {user.banned ? (
                              <LuUserCheck className="w-3.5 h-3.5" />
                            ) : (
                              <LuUserX className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog
        open={Boolean(editingUser)}
        onOpenChange={(open) => {
          if (!open) setEditingUser(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <LuShieldCheck className="w-5 h-5 text-primary" />
              {isAr ? "تغيير صلاحيات ورتبة الحساب" : "Assign User Role"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {isAr
                ? `اختر الدور المناسب للمستخدم: ${editingUser?.fullName}`
                : `Select the permissions tier for ${editingUser?.fullName}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3">
            {[
              {
                id: "admin",
                title: isAr ? "مسؤول النظام (Admin)" : "System Administrator",
                desc: isAr
                  ? "صلاحيات كاملة للوصول للوحة التحكم، تعديل ونشر المقالات والمشاريع والإعدادات."
                  : "Full access to dashboard, content publishing, team, and security settings.",
                icon: LuShieldAlert,
                badge: "accent",
              },
              {
                id: "team",
                title: isAr ? "عضو فريق (Team Member)" : "Team Contributor",
                desc: isAr
                  ? "ظهور في صفحات الفريق وصلاحيات تحريرية مخصصة."
                  : "Listed in official team roster with internal editorial privileges.",
                icon: LuUserCheck,
                badge: "default",
              },
              {
                id: "member",
                title: isAr ? "مستخدم عادي (Member)" : "Standard Member",
                desc: isAr
                  ? "مستخدم مسجل يمتلك صلاحية كتابة التعليقات وإرسال الاستفسارات."
                  : "Standard authenticated user with commenting and inquiries access.",
                icon: LuUser,
                badge: "outline",
              },
            ].map((option) => {
              const isSelected = selectedRole === option.id;
              const Icon = option.icon;

              return (
                <div
                  key={option.id}
                  onClick={() => setSelectedRole(option.id as AdminUserRole)}
                  className={`p-3 rounded-xl border text-start cursor-pointer transition-all duration-150 flex items-start gap-3 ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border/70 hover:border-border hover:bg-muted/30"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-foreground">{option.title}</p>
                      {isSelected && <LuCheck className="w-4 h-4 text-primary" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      {option.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingUser(null)}
              disabled={isSavingRole}
              className="rounded-xl text-xs cursor-pointer"
            >
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveRole}
              disabled={isSavingRole}
              className="rounded-xl text-xs cursor-pointer"
            >
              {isSavingRole
                ? isAr
                  ? "جاري الحفظ..."
                  : "Saving..."
                : isAr
                ? "حفظ الدور"
                : "Save Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban / Unban Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(banningUser)}
        onOpenChange={(open) => {
          if (!open) setBanningUser(null);
        }}
        title={
          banningUser?.banned
            ? isAr
              ? "إلغاء حظر المستخدم"
              : "Lift User Ban"
            : isAr
            ? "حظر حساب المستخدم"
            : "Ban User Account"
        }
        description={
          banningUser?.banned
            ? isAr
              ? `هل أنت متأكد من رغبتك في رفع الحظر عن حساب ${banningUser?.fullName}؟ سيتمكن من تسجيل الدخول والمشاركة مجدداً.`
              : `Are you sure you want to lift the ban on ${banningUser?.fullName}? They will regain login and participation access.`
            : isAr
            ? `هل أنت متأكد من حظر حساب ${banningUser?.fullName}؟ لن يتمكن من تسجيل الدخول أو نشر أي تعليقات جديدة.`
            : `Are you sure you want to ban ${banningUser?.fullName}? They will be prevented from signing in or posting reviews.`
        }
        confirmLabel={
          banningUser?.banned
            ? isAr
              ? "رفع الحظر"
              : "Lift Ban"
            : isAr
            ? "حظر الحساب"
            : "Ban User"
        }
        cancelLabel={isAr ? "إلغاء" : "Cancel"}
        variant={banningUser?.banned ? "default" : "destructive"}
        isLoading={isTogglingBan}
        onConfirm={handleConfirmBanToggle}
      />
    </div>
  );
}
