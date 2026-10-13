import { z } from "zod";

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .optional(),

  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Phone number must contain exactly 10 digits")
    .optional(),

  profileImage: z
    .string()
    .trim()
    .url("Invalid profile image URL")
    .optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;