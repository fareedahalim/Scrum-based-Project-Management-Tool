import { AddProjectMemberDTO } from "../../dtos/projectMember/requestDTOs/AddProjectMemberDTO";
import { ProjectMemberResponseDTO } from "../../dtos/projectMember/responseDTOs/ProjectMemberResponseDTO";

export interface IAddProjectMemberUseCase {
    execute(
        projectId: string,
        data: AddProjectMemberDTO
    ): Promise<ProjectMemberResponseDTO>;
}