import { z } from "zod";

export const createUserTaskValidator = z.object({
  user_id: z.preprocess(
    (val) => (typeof val === "string" ? Number(val.trim()) : val),
    z.number().int().positive(),
  ),
  task_id: z.preprocess(
    (val) => (typeof val === "string" ? Number(val.trim()) : val),
    z.number().int().positive(),
  ),
  role: z.preprocess(
    (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
    z.enum(["ASSIGNEE", "REVIEWER"]).optional(),
  ),
});

export const updateUserTaskValidator = z
  .object({
    role: z.preprocess(
      (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
      z.enum(["ASSIGNEE", "REVIEWER"]).optional(),
    ),
  })
  .refine((obj) => Object.keys(obj).length > 0);

export default { createUserTaskValidator, updateUserTaskValidator };
