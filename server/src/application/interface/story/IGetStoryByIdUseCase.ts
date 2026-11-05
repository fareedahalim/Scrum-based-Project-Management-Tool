import { IStoryEntity } from "../../../domain/entities/Story/IStoryEntity";

export interface IGetStoryByIdUseCase {
    execute(
        storyId: string,
        userId: string
    ): Promise<IStoryEntity>;
}