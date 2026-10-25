
import { inject, injectable } from "tsyringe";

import { IRemoveProjectMemberUseCase } from "../../interface/projectMember/IRemoveProjectMemberUseCase";

import { IProjectRepository } from "../../../domain/interfaces/repositories/Project/IProjectRepository";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectMember/IProjectMemberRepository";
import { ITeamMemberRepository } from "../../../domain/interfaces/repositories/TeamMember/ITeamMemberRepository";

import { ProjectMemberStatus } from "../../../domain/enums/ProjectMemberStatus";
import { ProjectScrumRole } from "../../../domain/enums/ProjectScrumRole";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class RemoveProjectMemberUseCase
    implements IRemoveProjectMemberUseCase
{
    constructor(
        @inject("IProjectRepository")
        private readonly _projectRepository: IProjectRepository,

        @inject("IProjectMemberRepository")
        private readonly _projectMemberRepository: IProjectMemberRepository,

        @inject("ITeamMemberRepository")
        private readonly _teamMemberRepository: ITeamMemberRepository
    ) {}

    async execute(
        projectId: string,
        userId: string
    ): Promise<boolean> {
        // 1. Check whether the project exists and can be modified.
        const project =
            await this._projectRepository.findById(projectId);

        if (!project || project.status === "ARCHIVED") {
            throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND);
        }

        if (project.status === "COMPLETED") {
            throw new Error(
                "Cannot remove members from a completed project"
            );
        }

        // 2. Find the user's active individual project membership.
        const membership =
            await this._projectMemberRepository.findMembership(
                projectId,
                userId
            );

        if (
            !membership ||
            membership.status !== ProjectMemberStatus.ACTIVE
        ) {
            throw new Error("Active project membership not found");
        }

        // 3. Product Owner and Scrum Master cannot be removed here.
        // This ensures their required project roles are preserved.
        if (
            membership.scrumRole === ProjectScrumRole.PRODUCT_OWNER ||
            membership.scrumRole === ProjectScrumRole.SCRUM_MASTER
        ) {
            throw new Error(
                "Product Owner or Scrum Master cannot be removed. Assign their role to another member first."
            );
        }

        // 4. Team members must be managed through team membership,
        // not through individual project membership.
        const teamMembership =
            await this._teamMemberRepository.findMembership(
                project.teamId,
                userId
            );

        if (teamMembership) {
            throw new Error(
                "Cannot remove a team member through individual project membership"
            );
        }

        // 5. Remove the individual project membership.
        const removed =
            await this._projectMemberRepository.removeMember(
                projectId,
                userId
            );

        if (!removed) {
            throw new Error("Failed to remove project member");
        }

        return true;
    }
}
