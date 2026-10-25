import { inject, injectable } from "tsyringe";

import { IArchiveStoryUseCase } from "../../interface/story/IArchiveStoryUseCase";

import { IStoryRepository } from "../../../domain/interfaces/repositories/Story/IStoryRepository";

import { IStoryEntity } from "../../../domain/entities/Story/IStoryEntity";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectMember/IProjectMemberRepository";
import { ProjectScrumRole } from "../../../domain/enums/ProjectScrumRole";
import { ProjectMemberStatus } from "../../../domain/enums/ProjectMemberStatus";

@injectable()
export class ArchiveStoryUseCase implements IArchiveStoryUseCase {
    constructor(
        @inject("IStoryRepository")
        private _storyRepository: IStoryRepository,

        @inject("IProjectMemberRepository")
        private _projectMemberRepository: IProjectMemberRepository,
    ) { }

    async execute(
        projectId: string,
        storyId: string,
        archivedBy: string,
    ): Promise<IStoryEntity> {
        const story = await this._storyRepository.findById(storyId);

        if (!story) {
            throw new Error("Story not found.");
        }

        const membership =
            await this._projectMemberRepository.findMembership(
                story.projectId,
                archivedBy,
            );

        if (
            !membership ||
            membership.status !== ProjectMemberStatus.ACTIVE ||
            membership.scrumRole !== ProjectScrumRole.PRODUCT_OWNER
        ) {
            throw new Error("Only the assigned Product Owner can manage the backlog.");
        }

        if (story.projectId !== projectId) {
            throw new Error("Story does not belong to this project.");
        }

        if (story.isArchived) {
            throw new Error("Story is already archived.");
        }

        const archivedStory = await this._storyRepository.archiveStory(
            storyId,
            archivedBy,
        );

        if (!archivedStory) {
            throw new Error("Failed to archive story.");
        }

        return archivedStory;
    }
}