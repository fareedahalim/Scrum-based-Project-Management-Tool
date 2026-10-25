
import { inject, injectable } from "tsyringe";

import { IAddProjectMemberUseCase } from "../../interface/projectMember/IAddProjectMemberUseCase";
import { AddProjectMemberDTO } from "../../dtos/projectMember/requestDTOs/AddProjectMemberDTO";
import { ProjectMemberResponseDTO } from "../../dtos/projectMember/responseDTOs/ProjectMemberResponseDTO";

import { IProjectRepository } from "../../../domain/interfaces/repositories/Project/IProjectRepository";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectMember/IProjectMemberRepository";
import { ITeamMemberRepository } from "../../../domain/interfaces/repositories/TeamMember/ITeamMemberRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";

import { ProjectMemberStatus } from "../../../domain/enums/ProjectMemberStatus";
import { ProjectScrumRole } from "../../../domain/enums/ProjectScrumRole";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";

import { ProjectMemberMapper } from "../../../infrastructure/mappers/ProjectMemberMapper";

@injectable()
export class AddProjectMemberUseCase implements IAddProjectMemberUseCase {
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
        projectId: string,
        data: AddProjectMemberDTO
    ): Promise<ProjectMemberResponseDTO> {
        const project = await this._projectRepository.findById(projectId);

        if (!project || project.status === "ARCHIVED") {
            throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND);
        }

        if (project.status === "COMPLETED") {
            throw new Error("Cannot add members to a completed project");
        }

        const user = await this._userRepository.findById(data.userId);

        if (!user || !user.isActive) {
            throw new Error("User not found or inactive");
        }

        const existingMembership =
            await this._projectMemberRepository.findMembership(
                projectId,
                data.userId
            );

        if (existingMembership) {
            throw new Error("User is already an active project member");
        }

        const teamMembership =
            await this._teamMemberRepository.findMembership(
                project.teamId,
                data.userId
            );

        if (teamMembership) {
            throw new Error(
                "User already belongs to this project's team"
            );
        }

        const existingMemberships =
            await this._projectMemberRepository.getMembersByProject(projectId);

        if (
            data.scrumRole === ProjectScrumRole.PRODUCT_OWNER &&
            existingMemberships.some(
                (member) =>
                    member.scrumRole === ProjectScrumRole.PRODUCT_OWNER &&
                    member.status === ProjectMemberStatus.ACTIVE
            )
        ) {
            throw new Error("Project already has a Product Owner");
        }

        if (
            data.scrumRole === ProjectScrumRole.SCRUM_MASTER &&
            existingMemberships.some(
                (member) =>
                    member.scrumRole === ProjectScrumRole.SCRUM_MASTER &&
                    member.status === ProjectMemberStatus.ACTIVE
            )
        ) {
            throw new Error("Project already has a Scrum Master");
        }

        const membership = await this._projectMemberRepository.addMember({
            projectId,
            userId: data.userId,
            scrumRole: data.scrumRole,
            status: ProjectMemberStatus.ACTIVE,
            assignedAt: new Date(),
            completedAt: null,
        });

        return {
            id: membership._id!,
            projectId: membership.projectId,
            userId: membership.userId,
            scrumRole: membership.scrumRole,
            status: membership.status,
            assignedAt: membership.assignedAt,
            completedAt: membership.completedAt ?? null,
        };
    }
}
