
import { IEpicEntity } from "../../../domain/entities/Epic/IEpicEntity";

export interface IArchiveEpicUseCase {
    execute(
        epicId: string,
        archivedBy: string,
    ): Promise<IEpicEntity>;
}
