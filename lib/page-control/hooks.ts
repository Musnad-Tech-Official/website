"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPageControlsAction,
  updatePageControlAction,
  batchUpdatePageStatusAction,
  resetPageControlsAction,
} from "./actions";
import { pageControlKeys } from "@/lib/query/keys";
import type { PageControlItem, PageStatus } from "./types";

/**
 * Hook to fetch all page controls with TanStack Query v5 cache management.
 */
export function usePageControlsQuery(initialData?: PageControlItem[]) {
  return useQuery({
    queryKey: pageControlKeys.lists(),
    queryFn: async () => {
      const controls = await getPageControlsAction();
      return controls;
    },
    initialData,
  });
}

/**
 * Hook to update a single page control item with TanStack Query mutation.
 * Features optimistic cache updates for instant feedback.
 */
export function useUpdatePageControlMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<
        Pick<
          PageControlItem,
          | "status"
          | "showInNavbar"
          | "showInFooter"
          | "maintenanceNoticeEn"
          | "maintenanceNoticeAr"
        >
      >;
    }) => {
      const result = await updatePageControlAction(id, updates);
      if (!result.success || !result.item) {
        throw new Error(result.error || "Failed to update page settings.");
      }
      return result.item;
    },
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing queries so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: pageControlKeys.lists() });

      // Snapshot previous value
      const previous = queryClient.getQueryData<PageControlItem[]>(pageControlKeys.lists());

      // Optimistically update the cache
      if (previous) {
        queryClient.setQueryData<PageControlItem[]>(
          pageControlKeys.lists(),
          previous.map((item) =>
            item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
          )
        );
      }

      return { previous };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(pageControlKeys.lists(), context.previous);
      }
    },
    onSettled: () => {
      // Re-sync with server state
      queryClient.invalidateQueries({ queryKey: pageControlKeys.all });
    },
  });
}

/**
 * Hook to batch update multiple page statuses with TanStack Query mutation.
 */
export function useBatchUpdatePageStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: PageStatus }) => {
      const result = await batchUpdatePageStatusAction(ids, status);
      if (!result.success) {
        throw new Error(result.error || "Failed to batch update page statuses.");
      }
      return { ids, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageControlKeys.all });
    },
  });
}

/**
 * Hook to reset all page controls with TanStack Query mutation.
 */
export function useResetPageControlsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await resetPageControlsAction();
      if (!result.success) {
        throw new Error(result.error || "Failed to reset page controls.");
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageControlKeys.all });
    },
  });
}
