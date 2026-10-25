
import { ProjectScrumRole } from "../../../../domain/enums/ProjectScrumRole";
import { ProjectMemberStatus } from "../../../../domain/enums/ProjectMemberStatus";
import { UserRoles } from "../../../../domain/enums/UserRole";

export type ProjectMembershipSource = "TEAM" | "INDIVIDUAL";

export interface ProjectMemberListItemDTO {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
    role: UserRoles;
    scrumRole: ProjectScrumRole;
    status: ProjectMemberStatus;
    membershipSource: ProjectMembershipSource;
}

export interface ProjectMembersListResponseDTO {
    projectId: string;
    projectName: string;
    members: ProjectMemberListItemDTO[];
}
