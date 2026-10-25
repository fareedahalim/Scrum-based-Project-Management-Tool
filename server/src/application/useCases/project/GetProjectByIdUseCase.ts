
import { inject, injectable } from "tsyringe";

import { IGetProjectByIdUseCase } from "../../interface/project/IGetProjectByIdUseCase";

import { IProjectRepository } from "../../../domain/interfaces/repositories/Project/IProjectRepository";
import { ProjectStatus } from "../../../domain/enums/ProjectStatus";
import { ProjectResponseDTO } from "../../dtos/project/responseDTOs/ProjectResponseDTO";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class GetProjectByIdUseCase
  implements IGetProjectByIdUseCase
{
  constructor(
    @inject("IProjectRepository")
    private readonly projectRepository: IProjectRepository
  ) {}

  async execute(projectId: string): Promise<ProjectResponseDTO> {
    const project = await this.projectRepository.findById(projectId);

    if (!project || project.status === ProjectStatus.ARCHIVED) {
      throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND);
    }

    return {
      id: project._id!,
      name: project.name,
      key: project.key,
      description: project.description,
      status: project.status,
      priority: project.priority,
      startDate: project.startDate,
      endDate: project.endDate,
      teamId: project.teamId,
      createdBy: project.createdBy,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}
