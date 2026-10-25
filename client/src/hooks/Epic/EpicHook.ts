import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    archiveEpic,
    createEpic,
    getEpicsByProject,
    updateEpic,
    type CreateEpicPayload,
    type UpdateEpicPayload,
} from "../../services/Epic/epicService";

export const useGetEpicsByProject = (
    projectId: string,
    includeArchived = false,
) => {
    return useQuery({
        queryKey: ["epics", projectId, includeArchived],
        queryFn: () => getEpicsByProject(projectId, includeArchived),
        enabled: Boolean(projectId),
    });
};

export const useCreateEpic = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateEpicPayload) =>
            createEpic(projectId, payload),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["epics", projectId],
            });
        },
    });
};

interface UpdateEpicVariables {
    epicId: string;
    data: UpdateEpicPayload;
}

export const useUpdateEpic = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ epicId, data }: UpdateEpicVariables) =>
            updateEpic(projectId, epicId, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["epics", projectId],
            });
        },
    });
};

export const useArchiveEpic = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (epicId: string) =>
            archiveEpic(projectId, epicId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["epics", projectId],
            });
        },
    });
};