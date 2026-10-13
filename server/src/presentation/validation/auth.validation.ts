import { z } from "zod";
console.log("entering to the auth.validation.ts")
export const registerSchema = z.object({
    body: z.object({
        firstName: z
            .string({ message: "First name is required" })
            .trim()
            .min(1, "First name cannot be empty")
            .max(50, "First name cannot exceed 50 characters"),
        lastName: z
            .string({ message: "Last name is required" })
            .trim()
            .min(1, "Last name cannot be empty")
            .max(50, "Last name cannot exceed 50 characters"),
        email: z
            .string({ message: "Email is required" })
            .trim()
            .email("Please provide a valid email"),
        phone: z
            .string({ message: "Phone number is required" })
            .trim()
            .min(10, "Phone number must be at least 10 digits")
            .max(15, "Phone number cannot exceed 15 digits"),
        password: z
            .string({ message: "Password is required" })
            .min(6, "Password must be at least 6 characters"),
    }),
});


export const verifyEmailSchema = z.object({

    body: z.object({
        email: z
            .string({ message: "Email is required" })
            .trim()
            .email('Please provide a valid email'),

        otp: z
            .string({ message: 'OTP is required' })
            .trim()
            .length(4, 'OTP must be exactly 4 charecters'),
    }),

});

export const resendOtpSchema = z.object({
    body: z.object({
        email: z
            .string({ message: "Email is required" })
            .trim()
            .email('Please provide a valid Email')
    })
})


export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z
            .string({ message: "Email is required" })
            .trim()
            .email("Please provide a valid email"),
    }),
});

export const verifyResetOtpSchema = z.object({
    body: z.object({
        email: z
            .string({ message: "Email is required" })
            .trim()
            .email("Please provide a valid email"),
        otp: z
            .string({ message: "OTP is required" })
            .trim()
            .length(4, "OTP must be exactly 4 characters"),
    }),
});

export const resetPasswordSchema = z.object({
    body: z.object({
        email: z
            .string({ message: "Email is required" })
            .trim()
            .email("Please provide a valid email"),
        password: z
            .string({ message: "Password is required" })
            .min(6, "Password must be at least 6 characters"),
        confirmPassword: z
            .string({ message: "Confirm password is required" })
            .min(6, "Confirm password must be at least 6 characters"),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z
            .string({ message: 'Email is required' })
            .trim()
            .email('Please eprovide a valid email '),

        password: z
            .string({ message: 'Password is required' })
            .min(1, 'Password is required')
    })
})


export const googleLoginSchema = z.object({
  body: z.object({
    code: z
      .string()
      .min(1, "Google authorization code is required"),
  }),
});