import { z } from "zod";

export const createTaskSchema = z.object({
  project_id: z
    .number({ required_error: "Project ID is required" })
    .int()
    .positive(),
  title: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z
      .string({ required_error: "Title is required" })
      .min(1, "Title must not be empty")
  ),
  description: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().nullable().optional()
  ),
  status: z.preprocess(
    (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
    z.enum(["TODO", "DOING", "DONE"]).optional()
  ),
  difficulty: z.preprocess(
    (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
    z.enum(["EASY", "MEDIUM", "HARD"]).optional()
  ),
  due_date: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().nullable().optional()
  ),
});

export const updateTaskSchema = z
  .object({
    project_id: z
      .number({ required_error: "Project ID is required" })
      .int()
      .positive()
      .optional(),
    title: z
      .preprocess(
        (val) => (typeof val === "string" ? val.trim() : val),
        z.string().min(1, "Title must not be empty")
      )
      .optional(),
    description: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().nullable().optional()
    ),
    status: z.preprocess(
      (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
      z.enum(["TODO", "DOING", "DONE"]).optional()
    ),
    difficulty: z.preprocess(
      (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
      z.enum(["EASY", "MEDIUM", "HARD"]).optional()
    ),
    due_date: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().nullable().optional()
    ),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field must be provided",
  });

export default { createTaskSchema, updateTaskSchema };
