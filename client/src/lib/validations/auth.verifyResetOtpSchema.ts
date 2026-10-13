import { z } from "zod";

export const verifyResetOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(4, "OTP must be 4 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type VerifyResetOtpFormData = z.infer<
  typeof verifyResetOtpSchema
>;