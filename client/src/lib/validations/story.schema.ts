import { z } from "zod";

const allowedStoryPoints = [1, 2, 3, 5, 8, 13, 21] as const;

export const createStorySchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Story title is required")
        .max(150, "Story title must not exceed 150 characters"),

    description: z
        .string()
        .trim()
        .min(1, "Story description is required")
        .max(2000, "Story description must not exceed 2000 characters"),

    storyPoints: z
        .union([
            z.literal(1),
            z.literal(2),
            z.literal(3),
            z.literal(5),
            z.literal(8),
            z.literal(13),
            z.literal(21),
            z.null(),
        ])
        .refine(
            (value) => value !== null,
            "Please select story points",
        ),

    acceptanceCriteria: z
        .array(
            z.object({
                id: z.string(),
                description: z.string(),
                isCompleted: z.boolean(),
            }),
        )
        .refine(
            (criteria) =>
                criteria.some((item) => item.description.trim().length > 0),
            "Please add at least one non-empty acceptance criterion",
        ),

    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
});

export type CreateStoryFormData = z.infer<typeof createStorySchema>;