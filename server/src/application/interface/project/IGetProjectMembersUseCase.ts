import { ProjectMembersListResponseDTO } from "../../dtos/projectMember/responseDTOs/ProjectMembersListResponseDTO";

export interface IGetProjectMembersUseCase {
    execute(projectId: string): Promise<ProjectMembersListResponseDTO>;
}