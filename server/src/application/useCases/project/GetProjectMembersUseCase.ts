
import { inject, injectable } from "tsyringe";

import { IGetProjectMembersUseCase } from "../../interface/project/IGetProjectMembersUseCase";

import { IProjectRepository } from "../../../domain/interfaces/repositories/Project/IProjectRepository";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectMember/IProjectMemberRepository";
import { ITeamMemberRepository } from "../../../domain/interfaces/repositories/TeamMember/ITeamMemberRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";

import { ProjectScrumRole } from "../../../domain/enums/ProjectScrumRole";
import { ProjectMemberStatus } from "../../../domain/enums/ProjectMemberStatus";

import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";
import { ProjectMembersListResponseDTO } from "../../dtos/projectMember/responseDTOs/ProjectMembersListResponseDTO";

@injectable()
export class GetProjectMembersUseCase implements IGetProjectMembersUseCase {
    constructor(
        @inject("IProjectRepository")
        private readonly _projectRepository: IProjectRepository,

        @inject("IProjectMemberRepository")
        private readonly _projectMemberRepository: IProjectMemberRepository,

        @inject("ITeamMemberRepository")
        private readonly _teamMemberRepository: ITeamMemberRepository,

        @inject("IUserRepository")
        private readonly _userRepository: IUserRepository
    ) {}

    async execute(
        projectId: string
    ): Promise<ProjectMembersListResponseDTO> {
        const project = await this._projectRepository.findById(projectId);

        if (!project || project.status === "ARCHIVED") {
            throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND);
        }

        const [projectMemberships, teamMemberships] = await Promise.all([
            this._projectMemberRepository.getMembersByProject(projectId),
            this._teamMemberRepository.getMembersByTeam(project.teamId),
        ]);

        const membersMap = new Map<
            string,
            {
                userId: string;
                scrumRole: ProjectScrumRole;
                status: ProjectMemberStatus;
                membershipSource: "TEAM" | "INDIVIDUAL";
            }
        >();

        // Add active individual project memberships first.
        for (const membership of projectMemberships) {
            if (membership.status !== ProjectMemberStatus.ACTIVE) {
                continue;
            }

            membersMap.set(membership.userId, {
                userId: membership.userId,
                scrumRole: membership.scrumRole,
                status: membership.status,
                membershipSource: "INDIVIDUAL",
            });
        }

        // Include team members as Developers unless they already have
        // an active individual project membership.
        for (const teamMembership of teamMemberships) {
            const userId = teamMembership.userId;

            if (!membersMap.has(userId)) {
                membersMap.set(userId, {
                    userId,
                    scrumRole: ProjectScrumRole.DEVELOPER,
                    status: ProjectMemberStatus.ACTIVE,
                    membershipSource: "TEAM",
                });
            }
        }

        const members: ProjectMembersListResponseDTO["members"] = [];

        for (const member of membersMap.values()) {
            const user = await this._userRepository.findById(member.userId);

            // Ignore users that no longer exist or are inactive.
            if (!user || !user.isActive) {
                continue;
            }

            members.push({
                userId: member.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                profileImage: user.profileImage,
                role: user.role,
                scrumRole: member.scrumRole,
                status: member.status,
                membershipSource: member.membershipSource,
            });
        }

        return {
            projectId: project._id!,
            projectName: project.name,
            members,
        };
    }
}
