
import { IProjectMemberEntity } from "../../domain/entities/ProjectMember/IProjectMemberEntity";
import { ProjectMemberDocument } from "../database/models/Project/ProjectMemberModel";

export class ProjectMemberMapper {
  static toEntity(
    doc: ProjectMemberDocument
  ): IProjectMemberEntity {
    return {
      _id: doc._id.toString(),
      projectId: doc.projectId.toString(),
      userId: doc.userId.toString(),
      scrumRole: doc.scrumRole,
      status: doc.status,
      assignedAt: doc.assignedAt,
      completedAt: doc.completedAt,
    };
  }
}
