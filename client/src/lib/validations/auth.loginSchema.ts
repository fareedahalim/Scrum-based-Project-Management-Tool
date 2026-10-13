import z from "zod";

export const loginSchema = z.object({
    email: z.string().trim().email("InvLid email"),
    password: z.string().trim().min(6, "Password must be atleast 6 charecters")
});

export type LoginFormData = z.infer<typeof loginSchema>;