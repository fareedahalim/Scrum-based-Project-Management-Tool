
import { inject, injectable } from "tsyringe";

import { IEpicRepository } from "../../../domain/interfaces/repositories/Epic/IEpicRepository";
import { IProjectRepository } from "../../../domain/interfaces/repositories/Project/IProjectRepository";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectMember/IProjectMemberRepository";

import { IEpicEntity } from "../../../domain/entities/Epic/IEpicEntity";
import { EpicStatus } from "../../../domain/enums/EpicStatus";
import { ProjectPriority } from "../../../domain/enums/ProjectPriority";
import { ProjectScrumRole } from "../../../domain/enums/ProjectScrumRole";
import { ProjectMemberStatus } from "../../../domain/enums/ProjectMemberStatus";

import { CreateEpicDTO } from "../../dtos/epic/requestDTOs/CreateEpicDTO";
import { ICreateEpicUseCase } from "../../interface/epic/ICreateEpicUseCase";

@injectable()
export class CreateEpicUseCase implements ICreateEpicUseCase {
    constructor(
        @inject("IEpicRepository")
        private _epicRepository: IEpicRepository,

        @inject("IProjectRepository")
        private _projectRepository: IProjectRepository,

        @inject("IProjectMemberRepository")
        private _projectMemberRepository: IProjectMemberRepository,
    ) {}

    async execute(
        data: CreateEpicDTO,
        createdBy: string,
    ): Promise<IEpicEntity> {
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

        // 3. Validate and normalize the Epic fields.
        const name = data.name.trim();
        const key = data.key.trim().toUpperCase();
        const description = data.description.trim();

        if (!name) {
            throw new Error("Epic name is required.");
        }

        if (!key) {
            throw new Error("Epic key is required.");
        }

        const existingEpic = await this._epicRepository.findByKey(
            data.projectId,
            key,
        );

        if (existingEpic) {
            throw new Error(
                "An epic with this key already exists in the project.",
            );
        }

        const startDate = data.startDate
            ? new Date(data.startDate)
            : null;

        const targetDate = data.targetDate
            ? new Date(data.targetDate)
            : null;

        if (startDate && Number.isNaN(startDate.getTime())) {
            throw new Error("Invalid epic start date.");
        }

        if (targetDate && Number.isNaN(targetDate.getTime())) {
            throw new Error("Invalid epic target date.");
        }

        if (
            startDate &&
            targetDate &&
            targetDate < startDate
        ) {
            throw new Error(
                "Epic target date cannot be earlier than its start date.",
            );
        }

        const now = new Date();

        const epicData: IEpicEntity = {
            projectId: data.projectId,
            name,
            key,
            description,
            status: EpicStatus.OPEN,
            priority: data.priority ?? ProjectPriority.MEDIUM,
            startDate,
            targetDate,
            targetRelease: data.targetRelease?.trim() || null,
            isArchived: false,
            archivedAt: null,
            createdBy,
            updatedBy: createdBy,
            createdAt: now,
            updatedAt: now,
        };

        return await this._epicRepository.createEpic(epicData);
    }
}
