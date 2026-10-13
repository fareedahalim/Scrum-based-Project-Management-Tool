import { z } from "zod";

export const organizationSetupSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Organization name must be at least 2 characters")
      .max(100, "Organization name cannot exceed 100 characters"),

    logo: z
      .string()
      .optional(),

    description: z
      .string()
      .optional(),

    website: z
      .string()
      .optional(),
  }),
});