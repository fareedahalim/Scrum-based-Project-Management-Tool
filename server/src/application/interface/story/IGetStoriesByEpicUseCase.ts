import { IStoryEntity } from "../../../domain/entities/Story/IStoryEntity";

export interface IGetStoriesByEpicUseCase {
    execute(
        projectId: string,
        epicId: string,
        includeArchived?: boolean,
    ): Promise<IStoryEntity[]>;
}