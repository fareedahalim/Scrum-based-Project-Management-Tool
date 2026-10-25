import type { StoryStatus } from "../../../enums/StoryStatus";

export interface StoryFilter {
    search?: string;
    status?: StoryStatus;
    epicId?: string;
    includeArchived?: boolean;
    page?: number;
    limit?: number;
}

export interface PaginatedStories {
    stories: import("../../../entities/Story/IStoryEntity").IStoryEntity[];
    pagination: {
        page: number;
        limit: number;
        totalStories: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}