import { inject, injectable } from "tsyringe";

import { IGetStoriesByEpicUseCase } from "../../interface/story/IGetStoriesByEpicUseCase";

import { IStoryRepository } from "../../../domain/interfaces/repositories/Story/IStoryRepository";
import { IEpicRepository } from "../../../domain/interfaces/repositories/Epic/IEpicRepository";

import { IStoryEntity } from "../../../domain/entities/Story/IStoryEntity";

@injectable()
export class GetStoriesByEpicUseCase
    implements IGetStoriesByEpicUseCase {
    constructor(
        @inject("IStoryRepository")
        private _storyRepository: IStoryRepository,

        @inject("IEpicRepository")
        private _epicRepository: IEpicRepository,
    ) { }

    async execute(
        projectId: string,
        epicId: string,
        includeArchived: boolean = false,
    ): Promise<IStoryEntity[]> {
        const epic = await this._epicRepository.findById(epicId);

        if (!epic) {
            throw new Error("Epic not found.");
        }

        if (epic.projectId !== projectId) {
            throw new Error("Epic does not belong to this project.");
        }

        return await this._storyRepository.getStoriesByEpic(
            epicId,
            includeArchived,
        );
    }
}