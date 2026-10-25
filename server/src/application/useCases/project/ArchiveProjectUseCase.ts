
import { inject, injectable } from "tsyringe";

import { IArchiveProjectUseCase } from "../../interface/project/IArchiveProjectUseCase";

import { IProjectRepository } from "../../../domain/interfaces/repositories/Project/IProjectRepository";
import { ProjectStatus } from "../../../domain/enums/ProjectStatus";
import { ProjectResponseDTO } from "../../dtos/project/responseDTOs/ProjectResponseDTO";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class ArchiveProjectUseCase implements IArchiveProjectUseCase {
  constructor(
    @inject("IProjectRepository")
    private readonly _projectRepository: IProjectRepository
  ) {}

  async execute(projectId: string): Promise<ProjectResponseDTO> {
    const project = await this._projectRepository.findById(projectId);

    if (!project) {
      throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND);
    }

    if (project.status === ProjectStatus.ARCHIVED) {
      throw new Error(PROJECT_ERRORS.PROJECT_ALREADY_ARCHIEVED);
    }

    const archivedProject = await this._projectRepository.archiveProject(projectId);

    if (!archivedProject) {
      throw new Error(PROJECT_ERRORS.PROJECT_ARCHIVE_FAILED);
    }

    return {
      id: archivedProject._id!,
      name: archivedProject.name,
      key: archivedProject.key,
      description: archivedProject.description,
      status: archivedProject.status,
      priority: archivedProject.priority,
      startDate: archivedProject.startDate,
      endDate: archivedProject.endDate,
      teamId: archivedProject.teamId,
      createdBy: archivedProject.createdBy,
      createdAt: archivedProject.createdAt,
      updatedAt: archivedProject.updatedAt,
    };
  }
}
