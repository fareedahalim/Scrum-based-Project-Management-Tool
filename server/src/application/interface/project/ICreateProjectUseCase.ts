import { CreateProjectDTO } from "../../dtos/project/requestDTOs/CreateProjectDTO";
import { ProjectResponseDTO } from "../../dtos/project/responseDTOs/ProjectResponseDTO";

export interface ICreateProjectUseCase {
    execute(data: CreateProjectDTO, createdBy: string): Promise<ProjectResponseDTO>;
}