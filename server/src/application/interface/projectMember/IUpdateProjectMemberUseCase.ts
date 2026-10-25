import { ProjectScrumRole } from "../../../domain/enums/ProjectScrumRole";
import { ProjectMemberResponseDTO } from "../../dtos/projectMember/responseDTOs/ProjectMemberResponseDTO";

export interface IUpdateProjectMemberUseCase {
    execute(
        projectId: string,
        userId: string,
        scrumRole: ProjectScrumRole
    ): Promise<ProjectMemberResponseDTO>;
}