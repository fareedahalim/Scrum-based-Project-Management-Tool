import { UpdateProjectDTO } from "../../dtos/project/requestDTOs/UpdateProjectDTO";
import { ProjectResponseDTO } from "../../dtos/project/responseDTOs/ProjectResponseDTO";


export interface IUpdateProjectUseCase {
  execute(
    projectId: string,
    data: UpdateProjectDTO
  ): Promise<ProjectResponseDTO>;
}
