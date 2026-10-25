
import { inject, injectable } from "tsyringe";


import { IProjectRepository } from "../../../domain/interfaces/repositories/Project/IProjectRepository";
import { ProjectResponseDTO } from "../../dtos/project/responseDTOs/ProjectResponseDTO";
import { IGetAllProjectsUseCase } from "../../interface/project/IGetAllProjectUseCase";

@injectable()
export class GetAllProjectsUseCase implements IGetAllProjectsUseCase
{
  constructor(
    @inject("IProjectRepository")
    private readonly projectRepository: IProjectRepository
  ) {}

  async execute(): Promise<ProjectResponseDTO[]> {
    const projects = await this.projectRepository.getAllProjects();

    return projects.map((project) => ({
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
    }));
  }
}
