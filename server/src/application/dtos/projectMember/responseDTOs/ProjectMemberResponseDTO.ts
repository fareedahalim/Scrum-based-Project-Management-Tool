import { ProjectScrumRole } from "../../../../domain/enums/ProjectScrumRole";
import { ProjectMemberStatus } from "../../../../domain/enums/ProjectMemberStatus";

export interface ProjectMemberResponseDTO {
    id: string;
    projectId: string;
    userId: string;
    scrumRole: ProjectScrumRole;
    status: ProjectMemberStatus;
    assignedAt: Date;
    completedAt: Date | null;
}