import { z } from "zod";

export const createProfileSchema = z.object({
  user_id: z.number({ required_error: "User ID is required" }).int().positive(),
  full_name: z.string().nullable().optional(),
  avatar_url: z.string().url("Avatar URL must be valid").nullable().optional(),
});

export const updateProfileSchema = z
  .object({
    full_name: z.string().nullable().optional(),
    avatar_url: z.string().url("Avatar URL must be valid").nullable().optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field must be provided",
  });

export default { createProfileSchema, updateProfileSchema };
