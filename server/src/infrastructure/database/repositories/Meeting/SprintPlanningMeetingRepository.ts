import { injectable } from "tsyringe";
import { Model } from "mongoose";

import { BaseRepo } from "../base/BaseRepo";
import { ISprintPlanningMeetingRepository } from "../../../../domain/interfaces/repositories/Meeting/ISprintPlanningMeetingRepository";
import {
    SprintPlanningMeetingDocument,
    SprintPlanningMeetingModel,
} from "../../models/Meeting/SprintPlanningMeetingModel";
import { SprintPlanningMeetingMapper } from "../../../mappers/SprintPlanningMeetingMapper";
import { ISprintPlanningMeetingEntity } from "../../../../domain/entities/Meeting/ISprintPlanningMeetingEntity";

@injectable()
export class SprintPlanningMeetingRepository
    extends BaseRepo<ISprintPlanningMeetingEntity>
    implements ISprintPlanningMeetingRepository {

    constructor() {
        super(
            SprintPlanningMeetingModel as unknown as Model<ISprintPlanningMeetingEntity>
        );
    }

    async create(meeting: ISprintPlanningMeetingEntity): Promise<string> {
        return await super.create({
            projectId: meeting.projectId,
            title: meeting.title,
            meetingDate: meeting.meetingDate,
            meetingTime: meeting.meetingTime,
            agenda: meeting.agenda,
            meetingLink: meeting.meetingLink,
            selectedStoryIds: meeting.selectedStoryIds,
            status: meeting.status,
            createdBy: meeting.createdBy,
            createdAt: meeting.createdAt,
            updatedAt: meeting.updatedAt,
        })
    }

    async findById(meetingId: string): Promise<ISprintPlanningMeetingEntity | null> {

        const doc = await super.findById(meetingId);

        if (!doc) {
            return null;
        }
        return SprintPlanningMeetingMapper.toEntity(doc as unknown as SprintPlanningMeetingDocument);

    }

    async findByProjectId(projectId: string): Promise<ISprintPlanningMeetingEntity[]> {
        const docs = await SprintPlanningMeetingModel.find({ projectId });

        return docs.map((doc) =>
            SprintPlanningMeetingMapper.toEntity(
                doc as unknown as SprintPlanningMeetingDocument
            )
        );
    }

    async update(meeting: Partial<ISprintPlanningMeetingEntity>, meetingId: string): Promise<ISprintPlanningMeetingEntity | null> {
        const updatedDoc = await SprintPlanningMeetingModel.findByIdAndUpdate(meetingId,
            {
                ...meeting,
                updatedAt: new Date(),
            },
            { new: true }
        );

        if (!updatedDoc) {
            return null;
        }
        return SprintPlanningMeetingMapper.toEntity(
            updatedDoc as unknown as SprintPlanningMeetingDocument
        );

    }
}