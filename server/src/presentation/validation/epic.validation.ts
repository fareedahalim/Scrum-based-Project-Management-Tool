
import { z } from "zod";

import { ProjectPriority } from "../../domain/enums/ProjectPriority";
import { EpicStatus } from "../../domain/enums/EpicStatus";

const dateStringSchema = z
    .string()
    .trim()
    .refine(
        (value) => !Number.isNaN(Date.parse(value)),
        "Please provide a valid date"
    );

export const createEpicSchema = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(1, "Epic name is required"),

        key: z
            .string()
            .trim()
            .min(1, "Epic key is required")
            .regex(
                /^[A-Za-z0-9_-]+$/,
                "Epic key can contain only letters, numbers, hyphens, and underscores"
            ),

        description: z
            .string()
            .trim()
            .min(1, "Epic description is required"),

        priority: z.nativeEnum(ProjectPriority).optional(),

        startDate: dateStringSchema.nullable().optional(),

        targetDate: dateStringSchema.nullable().optional(),

        targetRelease: z.string().trim().nullable().optional(),
    }),
});

export const updateEpicSchema = z.object({
    body: z
        .object({
            name: z
                .string()
                .trim()
                .min(1, "Epic name is required")
                .optional(),

            description: z
                .string()
                .trim()
                .min(1, "Epic description is required")
                .optional(),

            status: z.nativeEnum(EpicStatus).optional(),

            priority: z.nativeEnum(ProjectPriority).optional(),

            startDate: dateStringSchema.nullable().optional(),

            targetDate: dateStringSchema.nullable().optional(),

            targetRelease: z.string().trim().nullable().optional(),
        })
        .refine(
            (data) =>
                Object.values(data).some(
                    (value) => value !== undefined
                ),
            {
                message: "At least one field must be provided for an update",
            }
        ),

    params: z.object({
        projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please provide a valid project ID"),
        epicId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please provide a valid epic ID"),
    }),
});
