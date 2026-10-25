
import { UpdateEpicDTO } from "../../dtos/epic/requestDTOs/UpdateEpicDTO";
import { IEpicEntity } from "../../../domain/entities/Epic/IEpicEntity";

export interface IUpdateEpicUseCase {
    execute(
        epicId: string,
        data: UpdateEpicDTO,
        updatedBy: string,
    ): Promise<IEpicEntity>;
}
