"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getArticlesAction,
  getArticleBySlugAction,
  saveArticleAction,
  deleteArticleAction,
  toggleArticleStatusAction,
} from "./actions";
import { articleKeys } from "@/lib/query/keys";
import type { Article, ArticleFormData, ArticleStatus } from "./types";

interface UseArticlesQueryOptions {
  status?: ArticleStatus;
  initialData?: Article[];
}

/**
 * Hook to fetch articles with TanStack Query v5 cache management.
 */
export function useArticlesQuery(options: UseArticlesQueryOptions = {}) {
  const { status, initialData } = options;

  return useQuery({
    queryKey: articleKeys.list({ status }),
    queryFn: async () => {
      const articles = await getArticlesAction(status);
      return articles;
    },
    initialData,
  });
}

/**
 * Hook to fetch a single article by slug.
 */
export function useArticleQuery(slug: string, initialData?: Article | null) {
  return useQuery({
    queryKey: articleKeys.detail(slug),
    queryFn: async () => {
      const article = await getArticleBySlugAction(slug);
      return article;
    },
    initialData: initialData ?? undefined,
    enabled: Boolean(slug),
  });
}

/**
 * Hook to save (create or edit) an article using TanStack Query mutation.
 * Automatically invalidates and synchronizes the article lists on success.
 */
export function useSaveArticleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: ArticleFormData) => {
      const result = await saveArticleAction(formData);
      if (!result.success || !result.article) {
        throw new Error(result.error || "Failed to save article.");
      }
      return result.article;
    },
    onSuccess: (savedArticle) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.all });
      queryClient.setQueryData(articleKeys.detail(savedArticle.slug), savedArticle);
    },
  });
}

/**
 * Hook to toggle an article status (draft / published) with optimistic update.
 */
export function useToggleArticleStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: ArticleStatus }) => {
      const result = await toggleArticleStatusAction(id, newStatus);
      if (!result.success) {
        throw new Error(result.error || "Failed to update article status.");
      }
      return { id, newStatus };
    },
    onMutate: async ({ id, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: articleKeys.all });
      const previous = queryClient.getQueryData<Article[]>(articleKeys.lists());

      if (previous) {
        queryClient.setQueryData<Article[]>(
          articleKeys.lists(),
          previous.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(articleKeys.lists(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.all });
    },
  });
}

/**
 * Hook to delete an article using TanStack Query mutation.
 */
export function useDeleteArticleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteArticleAction(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete article.");
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.all });
    },
  });
}
