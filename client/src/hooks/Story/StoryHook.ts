
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    archiveStory,
    createStory,
    getStoriesByEpic,
    getStoriesByProject,
    updateStory,
    type CreateStoryPayload,
    type GetStoriesFilters,
    type UpdateStoryPayload,
} from "../../services/Story/storyService";


export const useGetStoriesByProject = (
    projectId: string,
    filters: GetStoriesFilters = {},
) => {
    return useQuery({
        queryKey: ["stories", projectId, filters],
        queryFn: () => getStoriesByProject(projectId, filters),
        enabled: Boolean(projectId),

        // Keep the previous results visible while a new search loads.
        placeholderData: (previousData) => previousData,
    });
};


export const useGetStoriesByEpic = (
    projectId: string,
    epicId: string,
    includeArchived = false,
) => {
    return useQuery({
        queryKey: [
            "stories",
            projectId,
            "epic",
            epicId,
            includeArchived,
        ],
        queryFn: () =>
            getStoriesByEpic(projectId, epicId, includeArchived),
        enabled: Boolean(projectId && epicId),
    });
};

export const useCreateStory = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateStoryPayload) =>
            createStory(projectId, payload),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["stories", projectId],
            });
        },
    });
};

export const useUpdateStory = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            storyId,
            payload,
        }: {
            storyId: string;
            payload: UpdateStoryPayload;
        }) => updateStory(projectId, storyId, payload),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["stories", projectId],
            });
        },
    });
};

export const useArchiveStory = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (storyId: string) =>
            archiveStory(projectId, storyId),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["stories", projectId],
            });
        },
    });
};
