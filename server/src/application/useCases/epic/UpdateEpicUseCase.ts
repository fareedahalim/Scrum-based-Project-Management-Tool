
import { inject, injectable } from "tsyringe";

import { IUpdateEpicUseCase } from "../../interface/epic/IUpdateEpicUseCase";

import { IEpicRepository } from "../../../domain/interfaces/repositories/Epic/IEpicRepository";
import { IEpicEntity } from "../../../domain/entities/Epic/IEpicEntity";

import { UpdateEpicDTO } from "../../dtos/epic/requestDTOs/UpdateEpicDTO";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectMember/IProjectMemberRepository";

import { ProjectScrumRole } from "../../../domain/enums/ProjectScrumRole";
import { ProjectMemberStatus } from "../../../domain/enums/ProjectMemberStatus";

@injectable()
export class UpdateEpicUseCase implements IUpdateEpicUseCase {
    constructor(
        @inject("IEpicRepository")
        private _epicRepository: IEpicRepository,

        @inject("IProjectMemberRepository")
        private _projectMemberRepository: IProjectMemberRepository,
    ) {}

    async execute(
        epicId: string,
        data: UpdateEpicDTO,
        updatedBy: string,
    ): Promise<IEpicEntity> {
        // 1. Find the Epic.
        const epic = await this._epicRepository.findById(epicId);

        if (!epic) {
            throw new Error("Epic not found.");
        }

        // 2. Prevent updates to archived Epics.
        if (epic.isArchived) {
            throw new Error("Archived epics cannot be updated.");
        }

        // 3. Verify the active Product Owner.
        const membership =
            await this._projectMemberRepository.findMembership(
                epic.projectId,
                updatedBy,
            );

        if (
            !membership ||
            membership.status !== ProjectMemberStatus.ACTIVE ||
            membership.scrumRole !== ProjectScrumRole.PRODUCT_OWNER
        ) {
            throw new Error(
                "Only the assigned Product Owner can manage the backlog.",
            );
        }

        // 4. Prepare the fields to update.
        const updates: Partial<IEpicEntity> = {};

        if (data.name !== undefined) {
            const name = data.name.trim();

            if (!name) {
                throw new Error("Epic name cannot be empty.");
            }

            updates.name = name;
        }

        if (data.description !== undefined) {
            updates.description = data.description.trim();
        }

        if (data.status !== undefined) {
            updates.status = data.status;
        }

        if (data.priority !== undefined) {
            updates.priority = data.priority;
        }

        if (data.startDate !== undefined) {
            updates.startDate = data.startDate
                ? new Date(data.startDate)
                : null;
        }

        if (data.targetDate !== undefined) {
            updates.targetDate = data.targetDate
                ? new Date(data.targetDate)
                : null;
        }

        if (data.targetRelease !== undefined) {
            updates.targetRelease = data.targetRelease?.trim() || null;
        }

        if (Object.keys(updates).length === 0) {
            throw new Error(
                "At least one field must be provided for update.",
            );
        }

        // 5. Validate the final dates, including unchanged dates.
        const finalStartDate =
            updates.startDate !== undefined
                ? updates.startDate
                : epic.startDate;

        const finalTargetDate =
            updates.targetDate !== undefined
                ? updates.targetDate
                : epic.targetDate;

        if (
            finalStartDate &&
            Number.isNaN(finalStartDate.getTime())
        ) {
            throw new Error("Invalid epic start date.");
        }

        if (
            finalTargetDate &&
            Number.isNaN(finalTargetDate.getTime())
        ) {
            throw new Error("Invalid epic target date.");
        }

        if (
            finalStartDate &&
            finalTargetDate &&
            finalTargetDate < finalStartDate
        ) {
            throw new Error(
                "Epic target date cannot be earlier than its start date.",
            );
        }

        // 6. Update audit information.
        updates.updatedBy = updatedBy;
        updates.updatedAt = new Date();

        // 7. Save and return the updated Epic.
        const updatedEpic = await this._epicRepository.updateEpic(
            epicId,
            updates,
        );

        if (!updatedEpic) {
            throw new Error("Failed to update epic.");
        }

        return updatedEpic;
    }
}
