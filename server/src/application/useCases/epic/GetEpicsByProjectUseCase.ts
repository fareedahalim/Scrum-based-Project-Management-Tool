
import { inject, injectable } from "tsyringe";

import { IGetEpicsByProjectUseCase } from "../../interface/epic/IGetEpicsByProjectUseCase";

import { IEpicRepository } from "../../../domain/interfaces/repositories/Epic/IEpicRepository";
import { IProjectRepository } from "../../../domain/interfaces/repositories/Project/IProjectRepository";

import { IEpicEntity } from "../../../domain/entities/Epic/IEpicEntity";

@injectable()
export class GetEpicsByProjectUseCase implements IGetEpicsByProjectUseCase {
    constructor(
        @inject("IEpicRepository")
        private _epicRepository: IEpicRepository,

        @inject("IProjectRepository")
        private _projectRepository: IProjectRepository,
    ) {}

    async execute(
        projectId: string,
        includeArchived: boolean = false,
    ): Promise<IEpicEntity[]> {

        const project = await this._projectRepository.findById(projectId);

        if (!project) {
            throw new Error("Project not found.");
        }

        return await this._epicRepository.getEpicsByProject(
            projectId,
            includeArchived,
        );
    }
}
