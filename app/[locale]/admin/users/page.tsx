import * as React from "react";
import { UsersClient } from "@/components/admin/users/users-client";
import { getUsersAction } from "@/lib/users/actions";

interface AdminUsersProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminUsersPage({ params }: AdminUsersProps) {
  const { locale } = await params;
  const initialUsers = await getUsersAction();

  return <UsersClient initialUsers={initialUsers} locale={locale} />;
}
