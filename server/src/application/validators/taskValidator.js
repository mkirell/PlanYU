import { z } from "zod";

export const createTaskSchema = z.object({
  project_id: z.number().int().positive(),
  title: z.preprocess((val) => {
    if (typeof val !== "string") return val;
    const t = val.trim();
    return t ? t.charAt(0).toUpperCase() + t.slice(1) : t;
  }, z.string().min(1)),
  description: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().nullable().optional(),
  ),
  status: z.preprocess(
    (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
    z.enum(["TODO", "DOING", "DONE"]).optional(),
  ),
  difficulty: z.preprocess(
    (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
    z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  ),
  due_date: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().nullable().optional(),
  ),
});

export const updateTaskSchema = z
  .object({
    project_id: z.number().int().positive().optional(),
    title: z
      .preprocess((val) => {
        if (typeof val !== "string") return val;
        const t = val.trim();
        return t ? t.charAt(0).toUpperCase() + t.slice(1) : t;
      }, z.string().min(1))
      .optional(),
    description: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().nullable().optional(),
    ),
    status: z.preprocess(
      (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
      z.enum(["TODO", "DOING", "DONE"]).optional(),
    ),
    difficulty: z.preprocess(
      (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
      z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
    ),
    due_date: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().nullable().optional(),
    ),
  })
  .refine((obj) => Object.keys(obj).length > 0);

export default { createTaskSchema, updateTaskSchema };
