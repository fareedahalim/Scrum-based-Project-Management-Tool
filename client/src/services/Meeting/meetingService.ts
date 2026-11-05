import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";

export interface CreateSprintPlanningMeetingPayload {
    title: string;
    meetingDate: string;
    meetingTime: string;
    agenda: string;
    meetingLink?: string;
    selectedStoryIds: string[];
}

export const createSprintPlanningMeeting = async (
    projectId: string,
    payload: CreateSprintPlanningMeetingPayload,
): Promise<string> => {
    const response = await AxiosInstance.post(
        API_ROUTES.MEETING.CREATE_SPRINT_PLANNING_MEETING(projectId),
        payload,
    );

    return response.data.data;
};