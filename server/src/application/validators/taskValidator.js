import { z } from "zod";

export const createTaskValidator = z.object({
  project_id: z.number().int().positive(),
  title: z.preprocess((val) => {
    if (typeof val !== "string") return val;
    return val.trim().replace(/\b\w/g, (c) => c.toUpperCase());
  }, z.string().min(1)),
  description: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().nullable().optional(),
  ),
  stage_id: z.number().int().positive().optional(),
  priority: z.preprocess(
    (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
    z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  ),
  due_date: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().nullable().optional(),
  ),
});

export const updateTaskValidator = z
  .object({
    project_id: z.number().int().positive().optional(),
    title: z
      .preprocess((val) => {
        if (typeof val !== "string") return val;
        return val.trim().replace(/\b\w/g, (c) => c.toUpperCase());
      }, z.string().min(1))
      .optional(),
    description: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().nullable().optional(),
    ),
    stage_id: z.number().int().positive().optional(),
    priority: z.preprocess(
      (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
      z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    ),
    due_date: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().nullable().optional(),
    ),
  })
  .refine((obj) => Object.keys(obj).length > 0);

export default { createTaskValidator, updateTaskValidator };
