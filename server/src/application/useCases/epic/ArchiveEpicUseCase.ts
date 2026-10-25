
import { inject, injectable } from "tsyringe";

import { IArchiveEpicUseCase } from "../../interface/epic/IArchiveEpicUseCase";

import { IEpicRepository } from "../../../domain/interfaces/repositories/Epic/IEpicRepository";
import { IStoryRepository } from "../../../domain/interfaces/repositories/Story/IStoryRepository";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectMember/IProjectMemberRepository";

import { IEpicEntity } from "../../../domain/entities/Epic/IEpicEntity";
import { ProjectScrumRole } from "../../../domain/enums/ProjectScrumRole";
import { ProjectMemberStatus } from "../../../domain/enums/ProjectMemberStatus";

@injectable()
export class ArchiveEpicUseCase implements IArchiveEpicUseCase {
    constructor(
        @inject("IEpicRepository")
        private _epicRepository: IEpicRepository,

        @inject("IStoryRepository")
        private _storyRepository: IStoryRepository,

        @inject("IProjectMemberRepository")
        private _projectMemberRepository: IProjectMemberRepository,
    ) {}

    async execute(
        epicId: string,
        archivedBy: string,
    ): Promise<IEpicEntity> {
        // 1. Find the Epic.
        const epic = await this._epicRepository.findById(epicId);

        if (!epic) {
            throw new Error("Epic not found.");
        }

        // 2. Verify active Product Owner permission.
        const membership =
            await this._projectMemberRepository.findMembership(
                epic.projectId,
                archivedBy,
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

        // 3. Prevent repeated archiving.
        if (epic.isArchived) {
            throw new Error("Epic is already archived.");
        }

        // 4. Preserve Story history.
        const stories = await this._storyRepository.getStoriesByEpic(
            epicId,
            true,
        );

        if (stories.length > 0) {
            throw new Error(
                "Cannot archive an epic that contains stories. Archive or move its stories first.",
            );
        }

        // 5. Archive the Epic.
        const archivedEpic = await this._epicRepository.archiveEpic(
            epicId,
            archivedBy,
        );

        if (!archivedEpic) {
            throw new Error("Failed to archive epic.");
        }

        return archivedEpic;
    }
}
