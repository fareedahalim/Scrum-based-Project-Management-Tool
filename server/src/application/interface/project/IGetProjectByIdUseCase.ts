import { ProjectResponseDTO } from "../../dtos/project/responseDTOs/ProjectResponseDTO";


export interface IGetProjectByIdUseCase {
  execute(projectId: string): Promise<ProjectResponseDTO>;
}
