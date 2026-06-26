import { z } from "zod";
import { emailStringSchema } from "./emailSchema";
import { passwordSchema } from "./passwordSchema";
export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username must be no more than 20 characters")
  .regex(
    /^[a-z0-9_]+$/,
    "Username must contain only lowercase letters, numbers, and underscores"
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  email: emailStringSchema,
  password: passwordSchema,
  profilePicture: z.string().url().optional(),
});
