import { z } from "zod";

export const createInvitationSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),
});

export const acceptInvitationSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must not exceed 50 characters"),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(50, "Last name must not exceed 50 characters"),

    phone: z
      .string()
      .trim()
      .regex(
        /^\d{10}$/,
        "Phone number must be 10 digits"
      ),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /[A-Z]/,
        "Password must contain an uppercase letter"
      )
      .regex(
        /[a-z]/,
        "Password must contain a lowercase letter"
      )
      .regex(
        /\d/,
        "Password must contain a number"
      )
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain a special character"
      ),

    confirmPassword: z.string().min(
      1,
      "Please confirm your password"
    ),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type CreateInvitationFormData = z.infer<
  typeof createInvitationSchema
>;

export type AcceptInvitationFormData = z.infer<
  typeof acceptInvitationSchema
>;