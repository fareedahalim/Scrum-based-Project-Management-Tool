
import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";

export type StoryPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type StoryStatus = "DRAFT" | "READY";


export interface StoryPagination {
    page: number;
    limit: number;
    totalStories: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface PaginatedStories {
    stories: Story[];
    pagination: StoryPagination;
}

export interface GetStoriesFilters {
    search?: string;
    status?: StoryStatus;
    epicId?: string;
    includeArchived?: boolean;
    page?: number;
    limit?: number;
}

export interface AcceptanceCriterion {
    id: string;
    description: string;
    isCompleted: boolean;
}

export interface Story {
    _id: string;
    projectId: string;
    epicId: string;
    key: string;
    title: string;
    description: string;
    priority: StoryPriority;
    storyPoints: number | null;
    status: StoryStatus;
    acceptanceCriteria: AcceptanceCriterion[];
    labels: string[];
    isArchived: boolean;
    archivedAt: string | null;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateStoryPayload {
    epicId: string;
    title: string;
    description: string;
    priority?: StoryPriority;
    storyPoints?: number | null;
    acceptanceCriteria?: AcceptanceCriterion[];
    labels?: string[];
}

export interface UpdateStoryPayload {
    title?: string;
    description?: string;
    priority?: StoryPriority;
    storyPoints?: number | null;
    status?: StoryStatus;
    acceptanceCriteria?: AcceptanceCriterion[];
    labels?: string[];
}


export const getStoriesByProject = async (
    projectId: string,
    filters: GetStoriesFilters = {},
): Promise<PaginatedStories> => {
    const response = await AxiosInstance.get(
        API_ROUTES.STORY.GET_STORIES_BY_PROJECT(projectId),
        {
            params: {
                ...filters,
                includeArchived: filters.includeArchived ?? false,
            },
        },
    );

    return response.data.data;
};


export const getStoriesByEpic = async (
    projectId: string,
    epicId: string,
    includeArchived = false,
): Promise<Story[]> => {
    const response = await AxiosInstance.get(
        API_ROUTES.STORY.GET_STORIES_BY_EPIC(projectId, epicId),
        {
            params: { includeArchived },
        },
    );

    return response.data.data;
};

export const createStory = async (
    projectId: string,
    payload: CreateStoryPayload,
): Promise<Story> => {
    const response = await AxiosInstance.post(
        API_ROUTES.STORY.CREATE_STORY(projectId),
        payload,
    );

    return response.data.data;
};

export const updateStory = async (
    projectId: string,
    storyId: string,
    payload: UpdateStoryPayload,
): Promise<Story> => {
    const response = await AxiosInstance.patch(
        API_ROUTES.STORY.UPDATE_STORY(projectId, storyId),
        payload,
    );

    return response.data.data;
};

export const archiveStory = async (
    projectId: string,
    storyId: string,
): Promise<Story> => {
    const response = await AxiosInstance.patch(
        API_ROUTES.STORY.ARCHIVE_STORY(projectId, storyId),
    );

    return response.data.data;
};
