import { z } from "zod";

export const createSprintPlanningMeetingSchema = z.object({
    body: z.object({
        title: z.string().trim().min(1, "Meeting title is required"),

        meetingDate: z.coerce.date(),

        meetingTime: z.string().trim().min(1, "Meeting time is required"),

        agenda: z.string().trim().min(1, "Meeting agenda is required"),

        meetingLink: z.string().trim().optional(),

        selectedStoryIds: z
            .array(
                z.string().regex(
                    /^[0-9a-fA-F]{24}$/,
                    "Please provide a valid story ID"
                )
            )
            .min(1, "Please select at least one story"),
    }),

    params: z.object({
        projectId: z
            .string()
            .regex(
                /^[0-9a-fA-F]{24}$/,
                "Please provide a valid project ID"
            ),
    }),
});