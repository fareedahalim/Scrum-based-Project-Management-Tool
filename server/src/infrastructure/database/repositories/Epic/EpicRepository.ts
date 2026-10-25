
import { injectable } from "tsyringe";

import { IEpicEntity } from "../../../../domain/entities/Epic/IEpicEntity";
import { IEpicRepository } from "../../../../domain/interfaces/repositories/Epic/IEpicRepository";
import { EpicModel } from "../../models/Epic/EpicModel";
import { EpicMapper } from "../../../mappers/EpicMapper";

@injectable()
export class EpicRepository implements IEpicRepository {
    async createEpic(epic: IEpicEntity): Promise<IEpicEntity> {
        const doc = await EpicModel.create({
            projectId: epic.projectId,
            name: epic.name,
            key: epic.key.trim().toUpperCase(),
            description: epic.description,
            status: epic.status,
            priority: epic.priority,
            startDate: epic.startDate,
            targetDate: epic.targetDate,
            targetRelease: epic.targetRelease,
            isArchived: false,
            archivedAt: null,
            createdBy: epic.createdBy,
            updatedBy: epic.updatedBy,
        });

        return EpicMapper.toEntity(doc);
    }

    async findById(epicId: string): Promise<IEpicEntity | null> {
        const doc = await EpicModel.findById(epicId);

        return doc ? EpicMapper.toEntity(doc) : null;
    }

    async findByKey(
        projectId: string,
        key: string
    ): Promise<IEpicEntity | null> {
        const doc = await EpicModel.findOne({
            projectId,
            key: key.trim().toUpperCase(),
        });

        return doc ? EpicMapper.toEntity(doc) : null;
    }

    async getEpicsByProject(
        projectId: string,
        includeArchived = false
    ): Promise<IEpicEntity[]> {
        const filter: {
            projectId: string;
            isArchived?: boolean;
        } = { projectId };

        if (!includeArchived) {
            filter.isArchived = false;
        }

        const docs = await EpicModel.find(filter).sort({
            createdAt: -1,
        });

        return docs.map((doc) => EpicMapper.toEntity(doc));
    }

    async updateEpic(
        epicId: string,
        updates: Partial<IEpicEntity>
    ): Promise<IEpicEntity | null> {
        const allowedUpdates: Partial<IEpicEntity> = {};

        if (updates.name !== undefined) {
            allowedUpdates.name = updates.name;
        }

        if (updates.description !== undefined) {
            allowedUpdates.description = updates.description;
        }

        if (updates.status !== undefined) {
            allowedUpdates.status = updates.status;
        }

        if (updates.priority !== undefined) {
            allowedUpdates.priority = updates.priority;
        }

        if (updates.startDate !== undefined) {
            allowedUpdates.startDate = updates.startDate;
        }

        if (updates.targetDate !== undefined) {
            allowedUpdates.targetDate = updates.targetDate;
        }

        if (updates.targetRelease !== undefined) {
            allowedUpdates.targetRelease = updates.targetRelease;
        }

        if (updates.updatedBy !== undefined) {
            allowedUpdates.updatedBy = updates.updatedBy;
        }

        const doc = await EpicModel.findByIdAndUpdate(
            epicId,
            { $set: allowedUpdates },
            { new: true, runValidators: true }
        );

        return doc ? EpicMapper.toEntity(doc) : null;
    }

    async archiveEpic(
        epicId: string,
        archivedBy: string
    ): Promise<IEpicEntity | null> {
        const doc = await EpicModel.findByIdAndUpdate(
            epicId,
            {
                $set: {
                    isArchived: true,
                    archivedAt: new Date(),
                    updatedBy: archivedBy,
                },
            },
            { new: true, runValidators: true }
        );

        return doc ? EpicMapper.toEntity(doc) : null;
    }
}
