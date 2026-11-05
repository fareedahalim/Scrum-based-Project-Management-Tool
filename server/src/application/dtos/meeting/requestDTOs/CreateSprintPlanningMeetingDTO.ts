export interface CreateSprintPlanningDTO {
    projectId: string;
    title: string;
    meetingDate: Date;
    meetingTime: string;
    agenda: string;
    meetingLink?: string;
    selectedStoryIds: string[];
}