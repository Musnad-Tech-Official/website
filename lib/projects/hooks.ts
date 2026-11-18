"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectsAction,
  getProjectBySlugAction,
  saveProjectAction,
  deleteProjectAction,
  toggleProjectStatusAction,
  toggleProjectFeaturedAction,
} from "./actions";
import { projectKeys } from "@/lib/query/keys";
import type { Project, ProjectFormData, ProjectStatus } from "./types";

interface UseProjectsQueryOptions {
  status?: ProjectStatus;
  initialData?: Project[];
}

export function useProjectsQuery(options: UseProjectsQueryOptions = {}) {
  const { status, initialData } = options;

  return useQuery({
    queryKey: projectKeys.list({ status }),
    queryFn: async () => {
      const projects = await getProjectsAction(status);
      return projects;
    },
    initialData,
  });
}

export function useProjectQuery(slug: string, initialData?: Project | null) {
  return useQuery({
    queryKey: projectKeys.detail(slug),
    queryFn: async () => {
      const project = await getProjectBySlugAction(slug);
      return project;
    },
    initialData: initialData ?? undefined,
    enabled: Boolean(slug),
  });
}

export function useSaveProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: ProjectFormData) => {
      const result = await saveProjectAction(formData);
      if (!result.success || !result.project) {
        throw new Error(result.error || "Failed to save project.");
      }
      return result.project;
    },
    onSuccess: (savedProject) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.setQueryData(projectKeys.detail(savedProject.slug), savedProject);
    },
  });
}

export function useToggleProjectStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: ProjectStatus }) => {
      const result = await toggleProjectStatusAction(id, newStatus);
      if (!result.success) {
        throw new Error(result.error || "Failed to update project status.");
      }
      return { id, newStatus };
    },
    onMutate: async ({ id, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.all });
      // Project list queries use ["projects", "list", filters] keys, not
      // the bare ["projects", "list"] prefix. Update all mounted filtered lists.
      const previous = queryClient.getQueriesData<Project[]>({ queryKey: projectKeys.lists() });
      queryClient.setQueriesData<Project[]>(
        { queryKey: projectKeys.lists() },
        (items) => items?.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      for (const [key, data] of context?.previous ?? []) {
        queryClient.setQueryData(key, data);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useToggleProjectFeaturedMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const result = await toggleProjectFeaturedAction(id, featured);
      if (!result.success) {
        throw new Error(result.error || "Failed to update featured flag.");
      }
      return { id, featured };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteProjectAction(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete project.");
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}
