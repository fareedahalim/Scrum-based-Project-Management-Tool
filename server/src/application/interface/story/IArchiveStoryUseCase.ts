import { IStoryEntity } from "../../../domain/entities/Story/IStoryEntity";

export interface IArchiveStoryUseCase {
    execute(
        projectId: string,
        storyId: string,
        archivedBy: string,
    ): Promise<IStoryEntity>;
}