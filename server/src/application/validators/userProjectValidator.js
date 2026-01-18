import { z } from "zod";

export const createUserProjectSchema = z.object({
  user_id: z.number().int().positive(),
  project_id: z.number().int().positive(),
  role: z.preprocess(
    (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
    z.enum(["OWNER", "MEMBER"]).optional(),
  ),
});

export const updateUserProjectSchema = z
  .object({
    role: z.preprocess(
      (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
      z.enum(["OWNER", "MEMBER"]).optional(),
    ),
  })
  .refine((obj) => Object.keys(obj).length > 0);

export default { createUserProjectSchema, updateUserProjectSchema };
