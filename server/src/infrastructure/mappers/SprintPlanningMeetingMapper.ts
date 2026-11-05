import { ISprintPlanningMeetingEntity } from "../../domain/entities/Meeting/ISprintPlanningMeetingEntity";
import { SprintPlanningMeetingDocument } from "../database/models/Meeting/SprintPlanningMeetingModel";

export class SprintPlanningMeetingMapper {
    static toEntity(
        doc: SprintPlanningMeetingDocument
    ): ISprintPlanningMeetingEntity {
        return {
            _id: doc._id.toString(),
            projectId: doc.projectId.toString(),
            title: doc.title,
            meetingDate: doc.meetingDate,
            meetingTime: doc.meetingTime,
            agenda: doc.agenda,
            meetingLink: doc.meetingLink,
            selectedStoryIds: doc.selectedStoryIds.map(
                (storyId) => storyId.toString()
            ),
            status: doc.status,
            createdBy: doc.createdBy.toString(),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}