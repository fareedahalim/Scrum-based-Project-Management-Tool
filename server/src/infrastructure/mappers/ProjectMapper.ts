
import { IProjectEntity } from "../../domain/entities/Project/IProjectEntity";
import { ProjectDocument } from "../database/models/Project/ProjectModel";

export class ProjectMapper {
  static toEntity(doc: ProjectDocument): IProjectEntity {
    return {
      _id: doc._id.toString(),
      name: doc.name,
      key: doc.key,
      description: doc.description,
      status: doc.status,
      priority: doc.priority,
      startDate: doc.startDate,
      endDate: doc.endDate,
      teamId: doc.teamId.toString(),
      createdBy: doc.createdBy.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
