
import { inject, injectable } from "tsyringe";

import { IGetAvailableProjectMembersUseCase } from "../../interface/projectMember/IGetAvailableProjectMembersUseCase";

import { IProjectRepository } from "../../../domain/interfaces/repositories/Project/IProjectRepository";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectMember/IProjectMemberRepository";
import { ITeamMemberRepository } from "../../../domain/interfaces/repositories/TeamMember/ITeamMemberRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";

import { UserRoles } from "../../../domain/enums/UserRole";
import { ProjectMemberStatus } from "../../../domain/enums/ProjectMemberStatus";

import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";

import { AvailableProjectMemberDTO } from "../../dtos/projectMember/responseDTOs/AvailableProjectMemberDTO";

@injectable()
export class GetAvailableProjectMembersUseCase
    implements IGetAvailableProjectMembersUseCase
{
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
    ): Promise<AvailableProjectMemberDTO[]> {
        // 1. Validate the project.
        const project =
            await this._projectRepository.findById(projectId);

        if (!project || project.status === "ARCHIVED") {
            throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND);
        }

        if (project.status === "COMPLETED") {
            throw new Error(
                "Cannot get available members for a completed project"
            );
        }

        // 2. Get active individual project memberships.
        const projectMembers =
            await this._projectMemberRepository.getMembersByProject(
                projectId
            );

        const assignedUserIds = new Set(
            projectMembers
                .filter(
                    (member) =>
                        member.status === ProjectMemberStatus.ACTIVE
                )
                .map((member) => String(member.userId))
        );

        // 3. Exclude members of the project's selected team.
        const teamMembers =
            await this._teamMemberRepository.getMembersByTeam(
                project.teamId
            );

        for (const member of teamMembers) {
            assignedUserIds.add(String(member.userId));
        }

        // 4. Get users and filter eligible individual members.
        const users = await this._userRepository.findAll();

        return users
            .filter(
                (user) =>
                    user.isActive &&
                    user.role === UserRoles.MEMBER &&
                    user._id !== undefined &&
                    !assignedUserIds.has(String(user._id))
            )
            .map((user) => ({
                userId: String(user._id),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                ...(user.profileImage
                    ? { profileImage: user.profileImage }
                    : {}),
                role: user.role,
            }));
    }
}
