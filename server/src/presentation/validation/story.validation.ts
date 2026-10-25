
import { z } from "zod";

import { ProjectPriority } from "../../domain/enums/ProjectPriority";
import { StoryStatus } from "../../domain/enums/StoryStatus";

const storyPointsSchema = z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(5),
    z.literal(8),
    z.literal(13),
    z.literal(21),
    z.null(),
]);

const acceptanceCriterionSchema = z.object({
    id: z.string().trim().min(1, "Acceptance criterion ID is required"),
    description: z
        .string()
        .trim()
        .min(1, "Acceptance criterion description is required"),
    isCompleted: z.boolean(),
});

export const createStorySchema = z.object({
    body: z.object({
epicId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Please provide a valid epic ID"),        title: z.string().trim().min(1, "Story title is required"),
        description: z
            .string()
            .trim()
            .min(1, "Story description is required"),
        priority: z.nativeEnum(ProjectPriority).optional(),
        storyPoints: storyPointsSchema.optional(),
        acceptanceCriteria: z
            .array(acceptanceCriterionSchema)
            .optional(),
        labels: z
            .array(z.string().trim().min(1, "Label cannot be empty"))
            .optional(),
    }),
    params: z.object({
        projectId: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Please provide a valid project ID"),
    }),
});

export const updateStorySchema = z.object({
    body: z.object({
        title: z.string().trim().min(1, "Story title is required").optional(),
        description: z
            .string()
            .trim()
            .min(1, "Story description is required")
            .optional(),
        priority: z.nativeEnum(ProjectPriority).optional(),
        storyPoints: storyPointsSchema.optional(),
        status: z.nativeEnum(StoryStatus).optional(),
        acceptanceCriteria: z
            .array(acceptanceCriterionSchema)
            .optional(),
        labels: z
            .array(z.string().trim().min(1, "Label cannot be empty"))
            .optional(),
    }).refine(
        (data) => Object.values(data).some((value) => value !== undefined),
        {
            message: "At least one field must be provided for an update",
        }
    ),
    params: z.object({
        projectId: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Please provide a valid project ID"),
        storyId: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Please provide a valid story ID"),
    }),
});


export const archiveStorySchema = z.object({
    params: z.object({
        projectId: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Please provide a valid project ID"),
        storyId: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Please provide a valid story ID"),
    }),
});



export const getStoriesByProjectSchema = z.object({
    params: z.object({
        projectId: z
            .string()
            .regex(
                /^[0-9a-fA-F]{24}$/,
                "Please provide a valid project ID"
            ),
    }),

    query: z.object({
        search: z.string().trim().optional(),

        status: z.nativeEnum(StoryStatus).optional(),

        epicId: z
            .string()
            .regex(
                /^[0-9a-fA-F]{24}$/,
                "Please provide a valid epic ID"
            )
            .optional(),

        includeArchived: z
            .enum(["true", "false"])
            .optional(),

        page: z
            .string()
            .regex(/^[1-9]\d*$/, "Page must be a positive integer")
            .optional(),

        limit: z
            .string()
            .regex(/^[1-9]\d*$/, "Limit must be a positive integer")
            .refine(
                (value) => Number(value) <= 100,
                "Limit cannot exceed 100"
            )
            .optional(),
    }),
});


export const getStoriesByEpicSchema = z.object({
    params: z.object({
        projectId: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Please provide a valid project ID"),
        epicId: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Please provide a valid epic ID"),
    }),
});


