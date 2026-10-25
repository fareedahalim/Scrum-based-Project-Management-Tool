
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    addProjectMember,
    getAvailableProjectMembers,
    getProjectMembers,
    removeProjectMember,
    updateProjectMemberRole,
    type AddProjectMemberPayload,
    type UpdateProjectMemberRolePayload,
} from "../../services/Project/projectMemberService";

export const useGetProjectMembers = (projectId: string) => {
    return useQuery({
        queryKey: ["projectMembers", projectId],
        queryFn: () => getProjectMembers(projectId),
        enabled: Boolean(projectId),
    });
};

export const useGetAvailableProjectMembers = (projectId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ["availableProjectMembers", projectId],
        queryFn: () => getAvailableProjectMembers(projectId),
        enabled: Boolean(projectId) && enabled,
    });
};

export const useAddProjectMember = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: AddProjectMemberPayload) =>
            addProjectMember(projectId, payload),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["projectMembers", projectId],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["availableProjectMembers", projectId],
                }),
            ]);
        },
    });
};

export const useUpdateProjectMemberRole = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            userId,
            payload,
        }: {
            userId: string;
            payload: UpdateProjectMemberRolePayload;
        }) => updateProjectMemberRole(projectId, userId, payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["projectMembers", projectId],
            });
        },
    });
};

export const useRemoveProjectMember = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) =>
            removeProjectMember(projectId, userId),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["projectMembers", projectId],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["availableProjectMembers", projectId],
                }),
            ]);
        },
    });
};
