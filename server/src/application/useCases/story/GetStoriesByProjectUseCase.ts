
import { inject, injectable } from "tsyringe";

import { IGetStoriesByProjectUseCase } from "../../interface/story/IGetStoriesByProjectUseCase";

import { IStoryRepository } from "../../../domain/interfaces/repositories/Story/IStoryRepository";
import { IProjectRepository } from "../../../domain/interfaces/repositories/Project/IProjectRepository";

import { StoryFilter, PaginatedStories } from "../../../domain/interfaces/repositories/Story/StoryFilter";

@injectable()
export class GetStoriesByProjectUseCase
    implements IGetStoriesByProjectUseCase {

    constructor(
        @inject("IStoryRepository")
        private _storyRepository: IStoryRepository,

        @inject("IProjectRepository")
        private _projectRepository: IProjectRepository,
    ) {}

    async execute(
        projectId: string,
        filters: StoryFilter = {},
    ): Promise<PaginatedStories> {

        const project = await this._projectRepository.findById(projectId);

        if (!project) {
            throw new Error("Project not found.");
        }

        return await this._storyRepository.getStoriesByProject(
            projectId,
            filters,
        );
    }
}
