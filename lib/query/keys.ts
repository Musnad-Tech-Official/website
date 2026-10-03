/**
 * Centralized, type-safe Query Key Factory for TanStack Query v5.
 * Using a factory pattern ensures consistency between prefetching, queries,
 * and mutation invalidations.
 */

export const articleKeys = {
  all: ["articles"] as const,
  lists: () => [...articleKeys.all, "list"] as const,
  list: (filters?: { status?: string; search?: string; category?: string }) =>
    [...articleKeys.lists(), filters ?? {}] as const,
  details: () => [...articleKeys.all, "detail"] as const,
  detail: (slugOrId: string) => [...articleKeys.details(), slugOrId] as const,
};

export const pageControlKeys = {
  all: ["page-controls"] as const,
  lists: () => [...pageControlKeys.all, "list"] as const,
};
