import { z } from "zod";

export const createTeamSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Team name is required" })
      .trim()
      .min(1, "Team name is required"),

    description: z
      .string({ message: "Team description is required" })
      .trim()
      .min(1, "Team description is required"),

    lead: z
      .string({ message: "Team lead is required" })
      .trim()
      .min(1, "Team lead is required"),
  }),
});

export const updateTeamSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Team name cannot be empty")
      .optional(),

    description: z
      .string()
      .trim()
      .min(1, "Team description cannot be empty")
      .optional(),
  }),

  params: z.object({
    teamId: z
      .string()
      .trim()
      .min(1, "Team ID is required"),
  }),
});

export const addTeamMemberSchema = z.object({
  body: z.object({
    userId: z
      .string()
      .trim()
      .min(1, "User ID is required"),
  }),

  params: z.object({
    teamId: z
      .string()
      .trim()
      .min(1, "Team ID is required"),
  }),
});

export const changeTeamLeadSchema = z.object({
  body: z.object({
    leadId: z
      .string()
      .trim()
      .min(1, "Team lead ID is required"),
  }),

  params: z.object({
    teamId: z
      .string()
      .trim()
      .min(1, "Team ID is required"),
  }),
});