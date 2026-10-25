import { ProjectResponseDTO } from "../../dtos/project/responseDTOs/ProjectResponseDTO";


export interface IArchiveProjectUseCase {
  execute(projectId: string): Promise<ProjectResponseDTO>;
}
