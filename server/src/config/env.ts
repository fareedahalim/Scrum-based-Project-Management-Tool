import "dotenv/config";
import z from "zod";

const envSchema = z.object({
    PORT: z.coerce.number()
        .default(5000),

    NODE_ENV: z
        .enum(["development", "production"])
        .default("development"),

    APP_URL: z.string().url(),

    CLIENT_URL: z.string().url(),

    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),



    REDIS_URL: z.string().min(1, "REDIS_URL is required"),

    EMAIL_HOST: z.string().trim(),
    EMAIL_PORT: z
        .string()
        .trim()
        .transform(Number)
        .refine((val) => !isNaN(val)),
    EMAIL_USER: z.string().trim().email(),
    EMAIL_PASS: z.string().trim(),
    EMAIL_FROM: z.string().trim(),

    GOOGLE_CLIENT_ID: z
        .string()
        .trim()
        .min(1, "GOOGLE_CLIENT_ID is required"),

    GOOGLE_CLIENT_SECRET: z
        .string()
        .trim()
        .min(1, "GOOGLE_CLIENT_SECRET is required"),

    GOOGLE_REDIRECT_URI: z
        .string()
        .trim()
        .url("GOOGLE_REDIRECT_URI must be a valid URL"),

    JWT_ACCESS_SECRET: z.string().trim().min(20),
    JWT_REFRESH_SECRET: z.string().trim().min(20),
    JWT_ACCESS_EXPIRATION: z.string().trim().default("30m"),
    JWT_REFRESH_EXPIRATION: z.string().trim().default("7d"),
    REFRESH_TOKEN_MAX_AGE: z.string().trim().transform(Number).refine((val) => !isNaN(val)),

    AUTH_API_PREFIX: z.string().trim().min(1),
    ORGANIZATION_API_PREFIX: z.string().trim().min(1),
    USER_API_PREFIX: z.string().trim().min(1),
    INVITATION_API_PREFIX: z.string().trim().min(1),
    TEAM_API_PREFIX: z.string().trim().min(1),
    PROJECT_API_PREFIX: z.string().trim().min(1),
    EPIC_API_PREFIX: z.string().trim().min(1),
    STORY_API_PREFIX: z.string().trim().min(1),

})

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Invalid environment variable");

    console.error(parsedEnv.error.flatten().fieldErrors);

    process.exit(1)
}

export const env = parsedEnv.data;