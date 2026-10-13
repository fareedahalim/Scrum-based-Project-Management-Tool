import z, { email } from "zod";

export const forgotPasswordSchema = z.object({
    email: z
           .string()
           .trim()
           .email("Please enter a vilid email address"),
})

export type ForgotSchemaType  = z.infer<typeof forgotPasswordSchema>