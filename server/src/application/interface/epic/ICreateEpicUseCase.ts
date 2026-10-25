import { CreateEpicDTO } from "../../dtos/epic/requestDTOs/CreateEpicDTO";
import { IEpicEntity } from "../../../domain/entities/Epic/IEpicEntity";

export interface ICreateEpicUseCase {
    execute(
        data: CreateEpicDTO,
        createdBy: string,
    ): Promise<IEpicEntity>;
}