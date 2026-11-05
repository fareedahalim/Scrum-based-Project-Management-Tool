import { inject, injectable } from "tsyringe";

import { IGetStoryByIdUseCase } from "../../interface/story/IGetStoryByIdUseCase";

import { IStoryRepository } from "../../../domain/interfaces/repositories/Story/IStoryRepository";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectMember/IProjectMemberRepository";

import { IStoryEntity } from "../../../domain/entities/Story/IStoryEntity";

@injectable()
export class GetStoryByIdUseCase implements IGetStoryByIdUseCase {

    constructor(
        @inject("IStoryRepository")
        private _storyRepository: IStoryRepository,

        @inject("IProjectMemberRepository")
        private _projectMemberRepository: IProjectMemberRepository,
    ) {}

    async execute(
        storyId: string,
        userId: string
    ): Promise<IStoryEntity> {

        const story = await this._storyRepository.findById(storyId);

        if (!story) {
            throw new Error("Story not found.");
        }

        const membership =
            await this._projectMemberRepository.findMembership(
                story.projectId,
                userId
            );

        if (!membership) {
            throw new Error("You do not have access to this story.");
        }

        return story;
    }
}