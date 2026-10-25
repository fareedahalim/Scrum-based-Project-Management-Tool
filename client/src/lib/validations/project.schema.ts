import { z } from "zod";

export const createProjectSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Project name must be at least 2 characters")
            .max(100, "Project name must not exceed 100 characters"),

        key: z
            .string()
            .trim()
            .toUpperCase()
            .min(2, "Project key must be at least 2 characters")
            .max(10, "Project key must not exceed 10 characters")
            .regex(
                /^[A-Z][A-Z0-9_-]*$/,
                "Project key must start with a letter and contain only uppercase letters, numbers, underscores, or hyphens"
            ),

        description: z
            .string()
            .trim()
            .min(1, "Project description is required")
            .max(500, "Description must not exceed 500 characters"),

        priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),

        startDate: z
            .string()
            .min(1, "Start date is required")
            .refine(
                (value) => !Number.isNaN(Date.parse(value)),
                "Please enter a valid start date"
            ),

        endDate: z
            .string()
            .optional()
            .or(z.literal(""))
            .refine(
                (value) => !value || !Number.isNaN(Date.parse(value)),
                "Please enter a valid end date"
            ),

        teamId: z
            .string()
            .min(1, "Please select a team"),

        productOwnerId: z
            .string()
            .min(1, "Please select a Product Owner"),

        scrumMasterId: z
            .string()
            .min(1, "Please select a Scrum Master"),

        additionalMemberIds: z
            .array(z.string())
            .optional()
            .default([]),
    })
    .superRefine((data, context) => {
        if (
            data.endDate &&
            Date.parse(data.endDate) < Date.parse(data.startDate)
        ) {
            context.addIssue({
                code: "custom",
                path: ["endDate"],
                message: "End date cannot be earlier than the start date",
            });
        }

        if (data.productOwnerId === data.scrumMasterId) {
            context.addIssue({
                code: "custom",
                path: ["scrumMasterId"],
                message: "Product Owner and Scrum Master must be different users",
            });
        }
    });

export type CreateProjectFormData = z.infer<
    typeof createProjectSchema
>;