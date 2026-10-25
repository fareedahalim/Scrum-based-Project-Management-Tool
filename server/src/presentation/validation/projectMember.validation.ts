import { z } from "zod";

const scrumRoleSchema = z.enum([
  "PRODUCT_OWNER",
  "SCRUM_MASTER",
  "DEVELOPER",
]);

export const addProjectMemberSchema = z.object({
  body: z.object({
    userId: z
      .string({ message: "User ID is required" })
      .trim()
      .min(1, "User ID is required"),

    scrumRole: scrumRoleSchema,
  }),

  params: z.object({
    projectId: z
      .string()
      .trim()
      .min(1, "Project ID is required"),
  }),
});

export const updateProjectMemberSchema = z.object({
  body: z.object({
    scrumRole: scrumRoleSchema,
  }),

  params: z.object({
    projectId: z
      .string()
      .trim()
      .min(1, "Project ID is required"),

    userId: z
      .string()
      .trim()
      .min(1, "User ID is required"),
  }),
});

export const removeProjectMemberSchema = z.object({
  params: z.object({
    projectId: z
      .string()
      .trim()
      .min(1, "Project ID is required"),

    userId: z
      .string()
      .trim()
      .min(1, "User ID is required"),
  }),
});