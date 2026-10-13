// organization.schema.ts

import { z } from "zod";

export const organizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Organization name must be at least 2 characters")
    .max(100, "Organization name must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters")
    .optional()
    .or(z.literal("")),

  website: z
    .string()
    .trim()
    .url("Please enter a valid website URL")
    .optional()
    .or(z.literal("")),

  logo: z
    .string()
    .trim()
    .url("Please enter a valid logo URL")
    .optional()
    .or(z.literal("")),
});

export type OrganizationFormData = z.infer<
  typeof organizationSchema
>;