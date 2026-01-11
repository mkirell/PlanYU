import { z } from "zod";

export const createUserProjectSchema = z.object({
  user_id: z.number({ required_error: "User ID is required" }).int().positive(),
  project_id: z
    .number({ required_error: "Project ID is required" })
    .int()
    .positive(),
  role: z.preprocess(
    (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
    z.enum(["OWNER", "MEMBER"]).optional()
  ),
});

export const updateUserProjectSchema = z
  .object({
    role: z.preprocess(
      (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
      z.enum(["OWNER", "MEMBER"]).optional()
    ),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field must be provided",
  });

export default { createUserProjectSchema, updateUserProjectSchema };
