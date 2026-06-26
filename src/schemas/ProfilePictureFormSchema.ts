import { z } from "zod";
export const ProfilePictureSchema = z.object({
  profilePicture: z
    .instanceof(File)
    .refine((file) => file.size <= 2000000, "Max file size is 2MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      "Only .jpg and .png files are allowed"
    ),
});
