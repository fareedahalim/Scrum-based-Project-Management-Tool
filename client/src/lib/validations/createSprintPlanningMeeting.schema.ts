import { z } from "zod";

export const createSprintPlanningMeetingSchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(3, "Meeting title must be at least 3 characters")
            .max(100, "Meeting title must not exceed 100 characters"),

        meetingDate: z
            .string()
            .min(1, "Meeting date is required")
            .refine(
                (value) => !Number.isNaN(Date.parse(value)),
                "Please enter a valid meeting date",
            )
            .refine(
                (value) => {
                    const today = new Date();

                    const localToday = [
                        today.getFullYear(),
                        String(today.getMonth() + 1).padStart(2, "0"),
                        String(today.getDate()).padStart(2, "0"),
                    ].join("-");

                    return value >= localToday;
                },
                "Meeting date cannot be in the past",
            ),

        meetingTime: z
            .string()
            .min(1, "Meeting time is required"),

        agenda: z
            .string()
            .trim()
            .min(10, "Agenda must be at least 10 characters")
            .max(500, "Agenda must not exceed 500 characters"),

        meetingLink: z
            .string()
            .trim()
            .optional()
            .or(z.literal(""))
            .refine(
                (value) =>
                    !value ||
                    z.string().url().safeParse(value).success,
                "Please enter a valid meeting URL",
            ),

        selectedStoryIds: z
            .array(z.string())
            .min(1, "Please select at least one READY story"),
    });

export type CreateSprintPlanningMeetingFormData = z.infer<
    typeof createSprintPlanningMeetingSchema
>;