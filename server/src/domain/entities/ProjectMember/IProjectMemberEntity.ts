import { ProjectMemberStatus } from "../../enums/ProjectMemberStatus";
import { ProjectScrumRole } from "../../enums/ProjectScrumRole";

export interface IProjectMemberEntity {
    _id?: string;
    projectId: string;
    userId: string;
    scrumRole: ProjectScrumRole;
    status: ProjectMemberStatus;
    assignedAt: Date;
    completedAt?: Date | null;
}