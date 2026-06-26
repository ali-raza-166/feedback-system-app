import { z } from "zod";

export const emailStringSchema = z.string().email({ message: "Invalid email address" });
export const emailSchema = z.object({
  email: emailStringSchema,
});
