import { ISprintPlanningMeetingEntity } from "../../../entities/Meeting/ISprintPlanningMeetingEntity";

export interface ISprintPlanningMeetingRepository {
    create(meeting: ISprintPlanningMeetingEntity): Promise<string>;
    findById(
        meetingId: string
    ): Promise<ISprintPlanningMeetingEntity | null>;

    findByProjectId(
        projectId: string
    ): Promise<ISprintPlanningMeetingEntity[]>;

    update(
        meeting: Partial<ISprintPlanningMeetingEntity>,
        meetingId: string
    ): Promise<ISprintPlanningMeetingEntity | null>;
}