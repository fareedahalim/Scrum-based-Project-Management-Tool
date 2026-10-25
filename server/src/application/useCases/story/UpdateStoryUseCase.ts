
import { inject, injectable } from "tsyringe";

import { IUpdateStoryUseCase } from "../../interface/story/IUpdateStoryUseCase";

import { IStoryRepository } from "../../../domain/interfaces/repositories/Story/IStoryRepository";
import { IEpicRepository } from "../../../domain/interfaces/repositories/Epic/IEpicRepository";
import { IProjectRepository } from "../../../domain/interfaces/repositories/Project/IProjectRepository";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectMember/IProjectMemberRepository";

import { IStoryEntity } from "../../../domain/entities/Story/IStoryEntity";
import { UpdateStoryDTO } from "../../dtos/story/requestDTOs/UpdateStoryDTO";

import { ProjectScrumRole } from "../../../domain/enums/ProjectScrumRole";
import { ProjectMemberStatus } from "../../../domain/enums/ProjectMemberStatus";
import { ProjectPriority } from "../../../domain/enums/ProjectPriority";
import { StoryStatus } from "../../../domain/enums/StoryStatus";

@injectable()
export class UpdateStoryUseCase implements IUpdateStoryUseCase {
    constructor(
        @inject("IStoryRepository")
        private _storyRepository: IStoryRepository,

        @inject("IEpicRepository")
        private _epicRepository: IEpicRepository,

        @inject("IProjectRepository")
        private _projectRepository: IProjectRepository,

        @inject("IProjectMemberRepository")
        private _projectMemberRepository: IProjectMemberRepository,
    ) {}

    async execute(
        projectId: string,
        storyId: string,
        data: UpdateStoryDTO,
        updatedBy: string,
    ): Promise<IStoryEntity> {
        // 1. Find the story.
        const story = await this._storyRepository.findById(storyId);

        if (!story) {
            throw new Error("Story not found.");
        }

        // 2. Verify project ownership.
        if (story.projectId !== projectId) {
            throw new Error("Story does not belong to this project.");
        }

        // 3. Verify the active Product Owner.
        const membership =
            await this._projectMemberRepository.findMembership(
                story.projectId,
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

        // 4. Archived stories cannot be updated.
        if (story.isArchived) {
            throw new Error("Cannot update an archived story.");
        }

        // 5. Prepare the updates.
        const updates: Partial<IStoryEntity> = {};

        if (data.title !== undefined) {
            const title = data.title.trim();

            if (!title) {
                throw new Error("Story title is required.");
            }

            updates.title = title;
        }

        if (data.description !== undefined) {
            const description = data.description.trim();

            if (!description) {
                throw new Error("Story description is required.");
            }

            updates.description = description;
        }

        if (data.priority !== undefined) {
            if (!Object.values(ProjectPriority).includes(data.priority)) {
                throw new Error("Invalid story priority.");
            }

            updates.priority = data.priority;
        }

        if (data.storyPoints !== undefined) {
            const validStoryPoints = [1, 2, 3, 5, 8, 13, 21];

            if (
                data.storyPoints !== null &&
                !validStoryPoints.includes(data.storyPoints)
            ) {
                throw new Error(
                    "Story points must be 1, 2, 3, 5, 8, 13, or 21.",
                );
            }

            updates.storyPoints = data.storyPoints;
        }

        if (data.status !== undefined) {
            if (!Object.values(StoryStatus).includes(data.status)) {
                throw new Error("Invalid story status.");
            }

            updates.status = data.status;
        }

        if (data.acceptanceCriteria !== undefined) {
            updates.acceptanceCriteria = data.acceptanceCriteria;
        }

        if (data.labels !== undefined) {
            updates.labels = data.labels.map((label) => label.trim());
        }

        // 6. Validate the complete story before allowing READY.
        // Also validate an existing READY story when it is edited
        // without changing its status.
        const isBeingMarkedReady =
            data.status === StoryStatus.READY ||
            (data.status === undefined &&
                story.status === StoryStatus.READY);

        if (isBeingMarkedReady) {
            const title = updates.title ?? story.title;
            const description = updates.description ?? story.description;
            const priority = updates.priority ?? story.priority;

            const storyPoints =
                updates.storyPoints !== undefined
                    ? updates.storyPoints
                    : story.storyPoints;

            const acceptanceCriteria =
                updates.acceptanceCriteria ?? story.acceptanceCriteria;

            // Title.
            if (!title.trim()) {
                throw new Error(
                    "A title is required for a READY story.",
                );
            }

            // Description.
            if (!description.trim()) {
                throw new Error(
                    "A description is required for a READY story.",
                );
            }

            // Priority.
            if (!Object.values(ProjectPriority).includes(priority)) {
                throw new Error(
                    "A valid priority is required for a READY story.",
                );
            }

            // Story points.
            const validStoryPoints = [1, 2, 3, 5, 8, 13, 21];

            if (
                storyPoints === null ||
                !validStoryPoints.includes(storyPoints)
            ) {
                throw new Error(
                    "A valid story point estimate is required for a READY story.",
                );
            }

            // Acceptance criteria.
            if (
                !Array.isArray(acceptanceCriteria) ||
                acceptanceCriteria.length === 0
            ) {
                throw new Error(
                    "At least one acceptance criterion is required for a READY story.",
                );
            }

            const hasIncompleteCriteria = acceptanceCriteria.some(
                (criterion) =>
                    !criterion.description ||
                    !criterion.description.trim(),
            );

            if (hasIncompleteCriteria) {
                throw new Error(
                    "Every acceptance criterion must have a description before the story can be READY.",
                );
            }
        }

        // 7. Verify the project and epic.
        const project = await this._projectRepository.findById(
            story.projectId,
        );

        if (!project) {
            throw new Error("Project not found.");
        }

        const epic = await this._epicRepository.findById(story.epicId);

        if (!epic) {
            throw new Error("Epic not found.");
        }

        if (epic.projectId !== story.projectId) {
            throw new Error(
                "Story's epic does not belong to its project.",
            );
        }

        if (epic.isArchived) {
            throw new Error(
                "Cannot update a story under an archived epic.",
            );
        }

        // 8. Update audit fields and save.
        updates.updatedBy = updatedBy;
        updates.updatedAt = new Date();

        const updatedStory = await this._storyRepository.updateStory(
            storyId,
            updates,
        );

        if (!updatedStory) {
            throw new Error("Failed to update story.");
        }

        return updatedStory;
    }
}
