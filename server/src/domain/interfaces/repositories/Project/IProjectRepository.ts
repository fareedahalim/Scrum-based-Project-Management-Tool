import { IProjectEntity } from "../../../entities/Project/IProjectEntity";

export interface IProjectRepository {
    createProject(project: IProjectEntity): Promise<IProjectEntity>;
    findById(projectId: string): Promise<IProjectEntity | null>;
    findByKey(key: string): Promise<IProjectEntity | null>;
    getAllProjects(): Promise<IProjectEntity[]>;
    getProjectsByTeam(teamId: string): Promise<IProjectEntity[]>;
    updateProject(projectId:string, data: Partial<IProjectEntity>): Promise<IProjectEntity | null>;
    archiveProject(projectId: string): Promise<IProjectEntity | null>;
}