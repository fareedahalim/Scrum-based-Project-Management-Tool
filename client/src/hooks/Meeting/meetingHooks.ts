import { useMutation } from "@tanstack/react-query";

import {
    createSprintPlanningMeeting,
    type CreateSprintPlanningMeetingPayload,
} from "../../services/Meeting/meetingService";

export const useCreateSprintPlanningMeeting = (
    projectId: string,
) => {
    return useMutation({
        mutationFn: (payload: CreateSprintPlanningMeetingPayload) =>
            createSprintPlanningMeeting(projectId, payload),
    });
};