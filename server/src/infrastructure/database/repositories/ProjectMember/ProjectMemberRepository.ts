
import { injectable } from "tsyringe";

import { IProjectMemberEntity } from "../../../../domain/entities/ProjectMember/IProjectMemberEntity";
import { IProjectMemberRepository } from "../../../../domain/interfaces/repositories/ProjectMember/IProjectMemberRepository";
import { ProjectMemberStatus } from "../../../../domain/enums/ProjectMemberStatus";
import { ProjectMemberMapper } from "../../../mappers/ProjectMemberMapper";
import { ProjectMemberModel } from "../../models/Project/ProjectMemberModel";

@injectable()
export class ProjectMemberRepository
  implements IProjectMemberRepository
{
  async addMember(
    projectMember: IProjectMemberEntity
  ): Promise<IProjectMemberEntity> {
    const existing = await ProjectMemberModel.findOne({
      projectId: projectMember.projectId,
      userId: projectMember.userId,
    });

    if (existing) {
      existing.scrumRole = projectMember.scrumRole;
      existing.status = ProjectMemberStatus.ACTIVE;
      existing.assignedAt = new Date();
      existing.completedAt = null;

      await existing.save();

      return ProjectMemberMapper.toEntity(existing);
    }

    const doc = await ProjectMemberModel.create({
      projectId: projectMember.projectId,
      userId: projectMember.userId,
      scrumRole: projectMember.scrumRole,
      status: ProjectMemberStatus.ACTIVE,
      assignedAt: new Date(),
      completedAt: null,
    });

    return ProjectMemberMapper.toEntity(doc);
  }

  async findMembership(
    projectId: string,
    userId: string
  ): Promise<IProjectMemberEntity | null> {
    const doc = await ProjectMemberModel.findOne({
      projectId,
      userId,
      status: ProjectMemberStatus.ACTIVE,
    });

    return doc ? ProjectMemberMapper.toEntity(doc) : null;
  }

  async getMembersByProject(
    projectId: string
  ): Promise<IProjectMemberEntity[]> {
    const docs = await ProjectMemberModel.find({
      projectId,
      status: ProjectMemberStatus.ACTIVE,
    }).sort({ assignedAt: 1 });

    return docs.map((doc) => ProjectMemberMapper.toEntity(doc));
  }

  async getProjectsByUser(
    userId: string
  ): Promise<IProjectMemberEntity[]> {
    const docs = await ProjectMemberModel.find({
      userId,
      status: ProjectMemberStatus.ACTIVE,
    }).sort({ assignedAt: -1 });

    return docs.map((doc) => ProjectMemberMapper.toEntity(doc));
  }

  async updateMembership(
    projectId: string,
    userId: string,
    data: Partial<IProjectMemberEntity>
  ): Promise<IProjectMemberEntity | null> {
    const allowedUpdates: Partial<IProjectMemberEntity> = {};

    if (data.scrumRole !== undefined) {
      allowedUpdates.scrumRole = data.scrumRole;
    }

    if (data.status !== undefined) {
      allowedUpdates.status = data.status;
    }

    if (data.completedAt !== undefined) {
      allowedUpdates.completedAt = data.completedAt;
    }

    const doc = await ProjectMemberModel.findOneAndUpdate(
      { projectId, userId },
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );

    return doc ? ProjectMemberMapper.toEntity(doc) : null;
  }

  async removeMember(
    projectId: string,
    userId: string
  ): Promise<boolean> {
    const doc = await ProjectMemberModel.findOneAndUpdate(
      {
        projectId,
        userId,
        status: ProjectMemberStatus.ACTIVE,
      },
      {
        $set: { status: ProjectMemberStatus.REMOVED },
      },
      { new: true }
    );

    return doc !== null;
  }
}
