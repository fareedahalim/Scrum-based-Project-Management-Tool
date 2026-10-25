
import { injectable } from "tsyringe";

import { IProjectEntity } from "../../../../domain/entities/Project/IProjectEntity";
import { IProjectRepository } from "../../../../domain/interfaces/repositories/Project/IProjectRepository";
import { ProjectStatus } from "../../../../domain/enums/ProjectStatus";
import { ProjectModel } from "../../models/Project/ProjectModel";
import { ProjectMapper } from "../../../mappers/ProjectMapper";

@injectable()
export class ProjectRepository implements IProjectRepository {
  async createProject(
    project: IProjectEntity
  ): Promise<IProjectEntity> {
    const doc = await ProjectModel.create({
      name: project.name,
      key: project.key,
      description: project.description,
      status: project.status,
      priority: project.priority,
      startDate: project.startDate,
      endDate: project.endDate,
      teamId: project.teamId,
      createdBy: project.createdBy,
    });

    return ProjectMapper.toEntity(doc);
  }

  async findById(
    projectId: string
  ): Promise<IProjectEntity | null> {
    const doc = await ProjectModel.findById(projectId);

    return doc ? ProjectMapper.toEntity(doc) : null;
  }

  async findByKey(
    key: string
  ): Promise<IProjectEntity | null> {
    const doc = await ProjectModel.findOne({
      key: key.trim().toUpperCase(),
    });

    return doc ? ProjectMapper.toEntity(doc) : null;
  }

  async getAllProjects(): Promise<IProjectEntity[]> {
    const docs = await ProjectModel.find({
      status: { $ne: ProjectStatus.ARCHIVED },
    }).sort({ createdAt: -1 });

    return docs.map((doc) => ProjectMapper.toEntity(doc));
  }

  async getProjectsByTeam(
    teamId: string
  ): Promise<IProjectEntity[]> {
    const docs = await ProjectModel.find({
      teamId,
      status: { $ne: ProjectStatus.ARCHIVED },
    }).sort({ createdAt: -1 });

    return docs.map((doc) => ProjectMapper.toEntity(doc));
  }

  async updateProject(
    projectId: string,
    data: Partial<IProjectEntity>
  ): Promise<IProjectEntity | null> {
    const allowedUpdates: Partial<IProjectEntity> = {};

    if (data.name !== undefined) {
      allowedUpdates.name = data.name;
    }

    if (data.description !== undefined) {
      allowedUpdates.description = data.description;
    }

    if (data.priority !== undefined) {
      allowedUpdates.priority = data.priority;
    }

    if (data.status !== undefined) {
      allowedUpdates.status = data.status;
    }

    if (data.startDate !== undefined) {
      allowedUpdates.startDate = data.startDate;
    }

    if (data.endDate !== undefined) {
      allowedUpdates.endDate = data.endDate;
    }

    if (data.teamId !== undefined) {
      allowedUpdates.teamId = data.teamId;
    }

    const doc = await ProjectModel.findByIdAndUpdate(
      projectId,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );

    return doc ? ProjectMapper.toEntity(doc) : null;
  }

  async archiveProject(
    projectId: string
  ): Promise<IProjectEntity | null> {
    const doc = await ProjectModel.findByIdAndUpdate(
      projectId,
      { $set: { status: ProjectStatus.ARCHIVED } },
      { new: true, runValidators: true }
    );

    return doc ? ProjectMapper.toEntity(doc) : null;
  }
}
