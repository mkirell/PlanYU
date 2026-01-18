import { z } from "zod";

export const createProfileSchema = z.object({
  user_id: z.number().int().positive(),
  full_name: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().nullable().optional(),
  ),
  avatar_url: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().url().nullable().optional(),
  ),
});

export const updateProfileSchema = z
  .object({
    full_name: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().nullable().optional(),
    ),
    avatar_url: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().url().nullable().optional(),
    ),
  })
  .refine((obj) => Object.keys(obj).length > 0);

export default { createProfileSchema, updateProfileSchema };
