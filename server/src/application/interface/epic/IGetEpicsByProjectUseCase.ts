
import { IEpicEntity } from "../../../domain/entities/Epic/IEpicEntity";

export interface IGetEpicsByProjectUseCase {
    execute(
        projectId: string,
        includeArchived?: boolean,
    ): Promise<IEpicEntity[]>;
}
