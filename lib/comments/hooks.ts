"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getArticleCommentsAction,
  addArticleCommentAction,
  deleteArticleCommentAction,
} from "./actions";
import { commentKeys } from "@/lib/query/keys";
import type { ArticleComment, AddCommentParams } from "./types";

/**
 * Hook to query comments for an article with TanStack Query caching.
 */
export function useArticleCommentsQuery(
  articleSlug: string,
  initialData?: ArticleComment[]
) {
  return useQuery({
    queryKey: commentKeys.byArticle(articleSlug),
    queryFn: async () => {
      const comments = await getArticleCommentsAction(articleSlug);
      return comments;
    },
    initialData,
    enabled: Boolean(articleSlug),
  });
}

/**
 * Hook to add a new comment or reply with automatic query invalidation.
 */
export function useAddArticleCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: AddCommentParams) => {
      const result = await addArticleCommentAction(params);
      if (!result.success || !result.comment) {
        throw new Error(result.error || "Failed to post comment");
      }
      return result.comment;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.byArticle(variables.articleSlug),
      });
    },
  });
}

/**
 * Hook to delete a comment with automatic query invalidation.
 */
export function useDeleteArticleCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      articleSlug,
    }: {
      commentId: string;
      articleSlug: string;
    }) => {
      const result = await deleteArticleCommentAction(commentId, articleSlug);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete comment");
      }
      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.byArticle(variables.articleSlug),
      });
    },
  });
}
