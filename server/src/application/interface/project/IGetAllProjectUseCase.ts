import { ProjectResponseDTO } from "../../dtos/project/responseDTOs/ProjectResponseDTO";


export interface IGetAllProjectsUseCase {
  execute(): Promise<ProjectResponseDTO[]>;
}
