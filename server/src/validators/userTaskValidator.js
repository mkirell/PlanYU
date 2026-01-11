import { z } from "zod";

export const createUserTaskSchema = z.object({
  user_id: z.preprocess(
    (val) => (typeof val === "string" ? Number(val.trim()) : val),
    z.number({ required_error: "User ID is required" }).int().positive()
  ),
  task_id: z.preprocess(
    (val) => (typeof val === "string" ? Number(val.trim()) : val),
    z.number({ required_error: "Task ID is required" }).int().positive()
  ),
  role: z.preprocess(
    (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
    z.enum(["ASSIGNEE", "REVIEWER"]).optional()
  ),
});

export const updateUserTaskSchema = z
  .object({
    role: z.preprocess(
      (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
      z.enum(["ASSIGNEE", "REVIEWER"]).optional()
    ),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field must be provided",
  });

export default { createUserTaskSchema, updateUserTaskSchema };
