
import { inject, injectable } from "tsyringe";

import { ICreateProjectUseCase } from "../../interface/project/ICreateProjectUseCase";

import { IProjectRepository } from "../../../domain/interfaces/repositories/Project/IProjectRepository";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectMember/IProjectMemberRepository";
import { ITeamRepository } from "../../../domain/interfaces/repositories/Team/ITeamRepository";
import { ITeamMemberRepository } from "../../../domain/interfaces/repositories/TeamMember/ITeamMemberRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";

import { CreateProjectDTO } from "../../dtos/project/requestDTOs/CreateProjectDTO";
import { ProjectResponseDTO } from "../../dtos/project/responseDTOs/ProjectResponseDTO";

import {
    PROJECT_ERRORS,
    USER_ERRORS,
} from "../../../domain/constants/errorMessages";

import { ProjectStatus } from "../../../domain/enums/ProjectStatus";
import { IProjectEntity } from "../../../domain/entities/Project/IProjectEntity";
import { ProjectPriority } from "../../../domain/enums/ProjectPriority";
import { ProjectScrumRole } from "../../../domain/enums/ProjectScrumRole";
import { ProjectMemberStatus } from "../../../domain/enums/ProjectMemberStatus";

@injectable()
export class CreateProjectUseCase implements ICreateProjectUseCase {
    constructor(
        @inject("IProjectRepository")
        private readonly _projectRepository: IProjectRepository,

        @inject("IProjectMemberRepository")
        private readonly _projectMemberRepository: IProjectMemberRepository,

        @inject("ITeamRepository")
        private readonly _teamRepository: ITeamRepository,

        @inject("ITeamMemberRepository")
        private readonly _teamMemberRepository: ITeamMemberRepository,

        @inject("IUserRepository")
        private readonly _userRepository: IUserRepository
    ) {}

    async execute(
        data: CreateProjectDTO,
        createdBy: string
    ): Promise<ProjectResponseDTO> {
        // 1. Validate the project creator.
        const creator =
            await this._userRepository.findById(createdBy);

        if (!creator || !creator.isActive) {
            throw new Error(PROJECT_ERRORS.PROJECT_CREATOR_INVALID);
        }

        // 2. Validate the selected team.
        const team =
            await this._teamRepository.findById(data.teamId);

        if (!team) {
            throw new Error(PROJECT_ERRORS.PROJECT_TEAM_NOT_FOUND);
        }

        // 3. A team can only be assigned to one unfinished project.
        const existingProjects =
            await this._projectRepository.getProjectsByTeam(
                data.teamId
            );

        const teamHasUnfinishedProject = existingProjects.some(
            (project) =>
                project.status !== ProjectStatus.COMPLETED &&
                project.status !== ProjectStatus.ARCHIVED
        );

        if (teamHasUnfinishedProject) {
            throw new Error(
                PROJECT_ERRORS.PROJECT_TEAM_ALREADY_ASSIGNED
            );
        }

        // 4. Product Owner and Scrum Master must be different users.
        if (data.productOwnerId === data.scrumMasterId) {
            throw new Error(
                PROJECT_ERRORS.PROJECT_ROLE_ASSIGNMENT_CONFLICT
            );
        }

        // 5. Validate the Product Owner.
        const productOwner =
            await this._userRepository.findById(
                data.productOwnerId
            );

        if (!productOwner || !productOwner.isActive) {
            throw new Error(USER_ERRORS.USER_NOT_FOUND);
        }

        // 6. Validate the Scrum Master.
        const scrumMaster =
            await this._userRepository.findById(
                data.scrumMasterId
            );

        if (!scrumMaster || !scrumMaster.isActive) {
            throw new Error(USER_ERRORS.USER_NOT_FOUND);
        }

        // 7. Validate additional member IDs.
        const additionalMemberIds =
            data.additionalMemberIds ?? [];

        if (
            new Set(additionalMemberIds).size !==
            additionalMemberIds.length
        ) {
            throw new Error(
                PROJECT_ERRORS.PROJECT_ADDITIONAL_DUPLICATE_MEMBER_NOT_ALLOWED
            );
        }

        if (
            additionalMemberIds.includes(data.productOwnerId) ||
            additionalMemberIds.includes(data.scrumMasterId)
        ) {
            throw new Error(
                PROJECT_ERRORS.PROJECT_ADDITIONAL_DUPLICATE_MEMBER_NOT_ALLOWED
            );
        }

        for (const userId of additionalMemberIds) {
            const user =
                await this._userRepository.findById(userId);

            if (!user || !user.isActive) {
                throw new Error(
                    `Additional member ${userId} does not exist or is inactive.`
                );
            }
        }

        // 8. Prepare the project entity.
        const now = new Date();

        const projectData: IProjectEntity = {
            name: data.name.trim(),
            key: data.key.trim().toUpperCase(),
            description: data.description.trim(),
            status: ProjectStatus.PLANNING,
            priority: data.priority ?? ProjectPriority.MEDIUM,
            startDate: new Date(data.startDate),
            endDate: data.endDate
                ? new Date(data.endDate)
                : null,
            teamId: data.teamId,
            createdBy,
            createdAt: now,
            updatedAt: now,
        };

        // 9. Create the project.
        const project =
            await this._projectRepository.createProject(
                projectData
            );

        if (!project._id) {
            throw new Error(
                "Project creation failed: project ID was not returned."
            );
        }

        // 10. Create the required Product Owner membership.
        const ownerMembership =
            await this._projectMemberRepository.addMember({
                projectId: project._id,
                userId: data.productOwnerId,
                scrumRole: ProjectScrumRole.PRODUCT_OWNER,
                status: ProjectMemberStatus.ACTIVE,
                assignedAt: now,
                completedAt: null,
            });

        if (
            ownerMembership.status !== ProjectMemberStatus.ACTIVE ||
            ownerMembership.scrumRole !== ProjectScrumRole.PRODUCT_OWNER
        ) {
            throw new Error(
                "Project creation failed: Product Owner membership was not saved correctly."
            );
        }

        // 11. Create the required Scrum Master membership.
        const scrumMasterMembership =
            await this._projectMemberRepository.addMember({
                projectId: project._id,
                userId: data.scrumMasterId,
                scrumRole: ProjectScrumRole.SCRUM_MASTER,
                status: ProjectMemberStatus.ACTIVE,
                assignedAt: now,
                completedAt: null,
            });

        if (
            scrumMasterMembership.status !== ProjectMemberStatus.ACTIVE ||
            scrumMasterMembership.scrumRole !== ProjectScrumRole.SCRUM_MASTER
        ) {
            throw new Error(
                "Project creation failed: Scrum Master membership was not saved correctly."
            );
        }

        // 12. Find members already belonging to the selected team.
        const teamMemberIds =
            await this._teamMemberRepository.getAssignedUserIdsByTeam(
                data.teamId
            );

        const teamMemberIdSet = new Set(
            teamMemberIds.map(String)
        );

        // 13. Add only additional users who are not already
        // members of the selected team.
        for (const userId of additionalMemberIds) {
            if (teamMemberIdSet.has(String(userId))) {
                continue;
            }

            await this._projectMemberRepository.addMember({
                projectId: project._id,
                userId,
                scrumRole: ProjectScrumRole.DEVELOPER,
                status: ProjectMemberStatus.ACTIVE,
                assignedAt: now,
                completedAt: null,
            });
        }

        // 14. Return the created project.
        return {
            id: project._id,
            name: project.name,
            key: project.key,
            description: project.description,
            status: project.status,
            priority: project.priority,
            startDate: project.startDate,
            endDate: project.endDate,
            teamId: project.teamId,
            createdBy: project.createdBy,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        };
    }
}
