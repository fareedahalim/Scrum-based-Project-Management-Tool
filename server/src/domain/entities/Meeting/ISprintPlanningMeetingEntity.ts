import { MeetingStatus } from "../../enums/MeetingStatus";

export interface ISprintPlanningMeetingEntity {
    _id?: string;
    projectId: string;
    title: string;
    meetingDate: Date;
    meetingTime: string;
    agenda: string;
    meetingLink?: string;
    selectedStoryIds: string[];
    status: MeetingStatus;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}