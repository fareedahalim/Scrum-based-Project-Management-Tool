import { IEpicEntity } from "../../../entities/Epic/IEpicEntity";

export interface IEpicRepository {
    createEpic(epic: IEpicEntity): Promise<IEpicEntity>;
    
    findById(epicId: string): Promise<IEpicEntity | null>;

    findByKey(projectId: string, key: string): Promise<IEpicEntity | null>;

    getEpicsByProject(projectId: string, includeArchived?: boolean): Promise<IEpicEntity[]>;

    updateEpic(epicId: string, updates: Partial<IEpicEntity>): Promise<IEpicEntity | null>;

    archiveEpic(epicId: string, archivedBy: string): Promise<IEpicEntity | null>
}