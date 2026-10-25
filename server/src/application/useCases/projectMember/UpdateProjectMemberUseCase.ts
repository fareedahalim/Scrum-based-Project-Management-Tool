
import { inject, injectable } from "tsyringe";

import { IUpdateProjectMemberUseCase } from "../../interface/projectMember/IUpdateProjectMemberUseCase";
import { ProjectMemberResponseDTO } from "../../dtos/projectMember/responseDTOs/ProjectMemberResponseDTO";

import { IProjectRepository } from "../../../domain/interfaces/repositories/Project/IProjectRepository";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectMember/IProjectMemberRepository";

import { ProjectScrumRole } from "../../../domain/enums/ProjectScrumRole";
import { ProjectMemberStatus } from "../../../domain/enums/ProjectMemberStatus";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class UpdateProjectMemberUseCase
    implements IUpdateProjectMemberUseCase
{
    constructor(
        @inject("IProjectRepository")
        private readonly _projectRepository: IProjectRepository,

        @inject("IProjectMemberRepository")
        private readonly _projectMemberRepository: IProjectMemberRepository
    ) {}

    async execute(
        projectId: string,
        userId: string,
        scrumRole: ProjectScrumRole
    ): Promise<ProjectMemberResponseDTO> {
        const project =
            await this._projectRepository.findById(projectId);

        if (!project || project.status === "ARCHIVED") {
            throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND);
        }

        if (project.status === "COMPLETED") {
            throw new Error(
                "Cannot update members of a completed project"
            );
        }

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

        // Validate role changes only when the role is actually changing.
        if (scrumRole !== membership.scrumRole) {
            const activeMembers =
                await this._projectMemberRepository.getMembersByProject(
                    projectId
                );

            const activeProjectMembers = activeMembers.filter(
                (member) =>
                    member.status === ProjectMemberStatus.ACTIVE
            );

            // Rule 1: Do not allow duplicate Product Owner or Scrum Master roles.
            if (
                scrumRole === ProjectScrumRole.PRODUCT_OWNER ||
                scrumRole === ProjectScrumRole.SCRUM_MASTER
            ) {
                const roleAlreadyAssigned =
                    activeProjectMembers.some(
                        (member) =>
                            member.userId !== userId &&
                            member.scrumRole === scrumRole
                    );

                if (roleAlreadyAssigned) {
                    throw new Error(
                        `Project already has a ${
                            scrumRole ===
                            ProjectScrumRole.PRODUCT_OWNER
                                ? "Product Owner"
                                : "Scrum Master"
                        }`
                    );
                }
            }

            // Rule 2: Do not allow removal of the last Product Owner.
            if (
                membership.scrumRole ===
                ProjectScrumRole.PRODUCT_OWNER
            ) {
                const anotherProductOwnerExists =
                    activeProjectMembers.some(
                        (member) =>
                            member.userId !== userId &&
                            member.scrumRole ===
                                ProjectScrumRole.PRODUCT_OWNER
                    );

                if (!anotherProductOwnerExists) {
                    throw new Error(
                        "This project must have a Product Owner. Assign another member as Product Owner before changing this role."
                    );
                }
            }

            // Rule 3: Do not allow removal of the last Scrum Master.
            if (
                membership.scrumRole ===
                ProjectScrumRole.SCRUM_MASTER
            ) {
                const anotherScrumMasterExists =
                    activeProjectMembers.some(
                        (member) =>
                            member.userId !== userId &&
                            member.scrumRole ===
                                ProjectScrumRole.SCRUM_MASTER
                    );

                if (!anotherScrumMasterExists) {
                    throw new Error(
                        "This project must have a Scrum Master. Assign another member as Scrum Master before changing this role."
                    );
                }
            }
        }

        const updated =
            await this._projectMemberRepository.updateMembership(
                projectId,
                userId,
                { scrumRole }
            );

        if (!updated) {
            throw new Error("Failed to update project member");
        }

        return {
            id: updated._id!,
            projectId: updated.projectId,
            userId: updated.userId,
            scrumRole: updated.scrumRole,
            status: updated.status,
            assignedAt: updated.assignedAt,
            completedAt: updated.completedAt ?? null,
        };
    }
}
