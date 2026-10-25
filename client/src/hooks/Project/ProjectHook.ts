
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    archiveProject,
    createProject,
    getProjectById,
    getProjects,
    updateProject,
    type CreateProjectPayload,
    type UpdateProjectPayload,
} from "../../services/Project/projectService";

// Fetch all projects
export const useGetProjects = () => {
    return useQuery({
        queryKey: ["projects"],
        queryFn: getProjects,
    });
};

// Fetch a single project
export const useGetProjectById = (projectId: string) => {
    return useQuery({
        queryKey: ["project", projectId],
        queryFn: () => getProjectById(projectId),
        enabled: Boolean(projectId),
    });
};

// Create a project
export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateProjectPayload) =>
            createProject(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects"],
            });
        },
    });
};

// Update a project
interface UpdateProjectVariables {
    projectId: string;
    data: UpdateProjectPayload;
}

export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ projectId, data }: UpdateProjectVariables) =>
            updateProject(projectId, data),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["projects"],
            });

            queryClient.invalidateQueries({
                queryKey: ["project", variables.projectId],
            });
        },
    });
};

// Archive a project
export const useArchiveProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (projectId: string) =>
            archiveProject(projectId),

        onSuccess: (_, projectId) => {
            queryClient.invalidateQueries({
                queryKey: ["projects"],
            });

            queryClient.invalidateQueries({
                queryKey: ["project", projectId],
            });
        },
    });
};
