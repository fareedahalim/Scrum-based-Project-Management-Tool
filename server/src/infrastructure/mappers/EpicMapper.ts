import { IEpicEntity } from "../../domain/entities/Epic/IEpicEntity";
import { EpicDocument } from "../database/models/Epic/EpicModel";

export class EpicMapper {
    static toEntity(doc: EpicDocument): IEpicEntity {
        return {
            _id: doc._id.toString(),
            projectId: doc.projectId.toString(),
            name: doc.name,
            key: doc.key,
            description: doc.description,
            status: doc.status,
            priority: doc.priority,
            startDate: doc.startDate ?? null,
            targetDate: doc.targetDate ?? null,
            targetRelease: doc.targetRelease ?? null,
            isArchived: doc.isArchived,
            archivedAt: doc.archivedAt ?? null,
            createdBy: doc.createdBy.toString(),
            updatedBy: doc.updatedBy.toString(),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}