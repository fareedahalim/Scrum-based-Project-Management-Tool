
import { UpdateStoryDTO } from "../../dtos/story/requestDTOs/UpdateStoryDTO";
import { IStoryEntity } from "../../../domain/entities/Story/IStoryEntity";

export interface IUpdateStoryUseCase {
    execute(
        projectId: string,
        storyId: string,
        data: UpdateStoryDTO,
        updatedBy: string,
    ): Promise<IStoryEntity>;
}
