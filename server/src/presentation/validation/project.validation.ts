
import { z } from "zod";

const projectStatusSchema = z.enum([
  "PLANNING",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
]);

const projectPrioritySchema = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
]);

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Please provide a valid ID");

const dateStringSchema = z
  .string({ message: "Date is required" })
  .trim()
  .min(1, "Date is required")
  .refine(
    (value) => !Number.isNaN(Date.parse(value)),
    "Please provide a valid date"
  );

export const createProjectSchema = z.object({
  body: z
    .object({
      name: z
        .string({ message: "Project name is required" })
        .trim()
        .min(1, "Project name is required"),

      key: z
        .string({ message: "Project key is required" })
        .trim()
        .min(2, "Project key must contain at least 2 characters")
        .max(10, "Project key cannot exceed 10 characters")
        .regex(
          /^[A-Za-z][A-Za-z0-9]*$/,
          "Project key must start with a letter and contain only letters and numbers"
        ),

      description: z
        .string({ message: "Project description is required" })
        .trim()
        .min(1, "Project description is required"),

      priority: projectPrioritySchema.optional(),

      startDate: dateStringSchema,

      endDate: dateStringSchema.nullable().optional(),

      teamId: objectIdSchema,

      productOwnerId: objectIdSchema,

      scrumMasterId: objectIdSchema,

      additionalMemberIds: z
        .array(objectIdSchema)
        .optional()
        .default([]),
    })
    .refine(
      (data) =>
        !data.endDate ||
        new Date(data.endDate) >= new Date(data.startDate),
      {
        message: "End date cannot be earlier than start date",
        path: ["endDate"],
      }
    )
    .refine(
      (data) => data.productOwnerId !== data.scrumMasterId,
      {
        message: "Product Owner and Scrum Master must be different users",
        path: ["scrumMasterId"],
      }
    ),
});

export const updateProjectSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(1, "Project name cannot be empty")
        .optional(),

      description: z
        .string()
        .trim()
        .min(1, "Project description cannot be empty")
        .optional(),

      priority: projectPrioritySchema.optional(),

      status: projectStatusSchema.optional(),

      startDate: dateStringSchema.optional(),

      endDate: dateStringSchema.nullable().optional(),

      teamId: objectIdSchema.optional(),
    })
    .refine(
      (data) => Object.values(data).some((value) => value !== undefined),
      {
        message: "Provide at least one field to update",
      }
    ),

  params: z.object({
    projectId: objectIdSchema,
  }),
});

export const projectIdParamSchema = z.object({
  params: z.object({
    projectId: objectIdSchema,
  }),
});
