
import { CreateStoryDTO } from "../../dtos/story/requestDTOs/CreateStoryDTO";
import { IStoryEntity } from "../../../domain/entities/Story/IStoryEntity";

export interface ICreateStoryUseCase {
    execute(
        data: CreateStoryDTO,
        createdBy: string,
    ): Promise<IStoryEntity>;
}
