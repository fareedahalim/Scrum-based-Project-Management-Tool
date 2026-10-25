import { IStoryEntity } from "../../../entities/Story/IStoryEntity";
import { PaginatedStories, StoryFilter } from "./StoryFilter";

export interface IStoryRepository {
    createStory(story: IStoryEntity): Promise<IStoryEntity>;

    findById(storyId: string): Promise<IStoryEntity | null>;

    findByKey(projectId: string, key: string): Promise<IStoryEntity | null>;

getStoriesByProject(
        projectId: string,
        filters?: StoryFilter,
    ): Promise<PaginatedStories>;
    getStoriesByEpic(epicId: string, includeArchived?: boolean): Promise<IStoryEntity[]>;

    updateStory(storyId: string, updates: Partial<IStoryEntity>): Promise<IStoryEntity | null>;

    archiveStory(storyId: string,archivedBy: string): Promise<IStoryEntity | null>;
}