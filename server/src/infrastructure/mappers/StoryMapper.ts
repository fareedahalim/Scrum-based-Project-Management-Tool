import { IStoryEntity } from "../../domain/entities/Story/IStoryEntity";
import { StoryDocument } from "../database/models/Story/StoryModel";

export class StoryMapper {
    static toEntity(doc: StoryDocument): IStoryEntity {
        return {
            _id: doc._id.toString(),
            projectId: doc.projectId.toString(),
            epicId: doc.epicId.toString(),
            key: doc.key,
            title: doc.title,
            description: doc.description,
            priority: doc.priority,
            storyPoints: doc.storyPoints ?? null,
            status: doc.status,
            acceptanceCriteria: doc.acceptanceCriteria.map((criterion) => ({
                id: criterion.id,
                description: criterion.description,
                isCompleted: criterion.isCompleted,
            })),
            labels: [...doc.labels],
            isArchived: doc.isArchived,
            archivedAt: doc.archivedAt ?? null,
            createdBy: doc.createdBy.toString(),
            updatedBy: doc.updatedBy.toString(),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}