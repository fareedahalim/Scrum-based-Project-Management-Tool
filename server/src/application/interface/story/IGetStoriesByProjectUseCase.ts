
import { StoryFilter, PaginatedStories } from "../../../domain/interfaces/repositories/Story/StoryFilter";

export interface IGetStoriesByProjectUseCase {
    execute(
        projectId: string,
        filters?: StoryFilter,
    ): Promise<PaginatedStories>;
}
