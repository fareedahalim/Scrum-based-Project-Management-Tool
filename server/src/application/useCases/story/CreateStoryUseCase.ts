
import { inject, injectable } from "tsyringe";

import { ICreateStoryUseCase } from "../../interface/story/ICreateStoryUseCase";

import { IStoryRepository } from "../../../domain/interfaces/repositories/Story/IStoryRepository";
import { IEpicRepository } from "../../../domain/interfaces/repositories/Epic/IEpicRepository";
import { IProjectRepository } from "../../../domain/interfaces/repositories/Project/IProjectRepository";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectMember/IProjectMemberRepository";

import { IStoryEntity } from "../../../domain/entities/Story/IStoryEntity";
import { StoryStatus } from "../../../domain/enums/StoryStatus";
import { ProjectPriority } from "../../../domain/enums/ProjectPriority";
import { ProjectMemberStatus } from "../../../domain/enums/ProjectMemberStatus";
import { ProjectScrumRole } from "../../../domain/enums/ProjectScrumRole";

import { CreateStoryDTO } from "../../dtos/story/requestDTOs/CreateStoryDTO";

@injectable()
export class CreateStoryUseCase implements ICreateStoryUseCase {
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
        data: CreateStoryDTO,
        createdBy: string,
    ): Promise<IStoryEntity> {
        // 1. Verify that the project exists.
        const project = await this._projectRepository.findById(
            data.projectId,
        );

        if (!project) {
            throw new Error("Project not found.");
        }

        // 2. Verify that the user is the active Product Owner.
        const membership =
            await this._projectMemberRepository.findMembership(
                data.projectId,
                createdBy,
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

        // 3. Verify that the Epic exists and belongs to this project.
        const epic = await this._epicRepository.findById(data.epicId);

        if (!epic) {
            throw new Error("Epic not found.");
        }

        if (epic.projectId !== data.projectId) {
            throw new Error(
                "Epic does not belong to the specified project.",
            );
        }

        if (epic.isArchived) {
            throw new Error(
                "Cannot create a story under an archived epic.",
            );
        }

        // 4. Validate the Story fields.
        const title = data.title.trim();
        const description = data.description.trim();

        if (!title) {
            throw new Error("Story title is required.");
        }

        if (!description) {
            throw new Error("Story description is required.");
        }

        const priority = data.priority ?? ProjectPriority.MEDIUM;

        if (!Object.values(ProjectPriority).includes(priority)) {
            throw new Error("Invalid story priority.");
        }

        const storyPoints = data.storyPoints ?? null;
        const validStoryPoints = [1, 2, 3, 5, 8, 13, 21];

        if (
            storyPoints !== null &&
            !validStoryPoints.includes(storyPoints)
        ) {
            throw new Error(
                "Story points must be 1, 2, 3, 5, 8, 13, or 21.",
            );
        }

        // 5. Generate a Story key and check for duplicates.
        const key = `${project.key}-${Date.now()}`;

        const existingStory = await this._storyRepository.findByKey(
            data.projectId,
            key,
        );

        if (existingStory) {
            throw new Error(
                "Generated story key already exists. Please try again.",
            );
        }

        // 6. Prepare the Story entity.
        const now = new Date();

        const storyData: IStoryEntity = {
            projectId: data.projectId,
            epicId: data.epicId,
            key,
            title,
            description,
            priority,
            storyPoints,
            status: StoryStatus.DRAFT,
            acceptanceCriteria: data.acceptanceCriteria ?? [],
            labels: data.labels ?? [],
            isArchived: false,
            archivedAt: null,
            createdBy,
            updatedBy: createdBy,
            createdAt: now,
            updatedAt: now,
        };

        // 7. Save and return the new Story.
        return await this._storyRepository.createStory(storyData);
    }
}
