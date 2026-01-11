import { z } from "zod";

export const createTaskSchema = z.object({
  project_id: z.number({ required_error: "Project ID is required" }).int().positive(),
  title: z.string({ required_error: "Title is required" }).min(1, "Title must not be empty"),
  description: z.string().nullable().optional(),
  status: z.enum(["TODO", "DOING", "DONE"]).optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  due_date: z.string().nullable().optional(),
});

export const updateTaskSchema = z
  .object({
    project_id: z.number({ required_error: "Project ID is required" }).int().positive().optional(),
    title: z.string({ required_error: "Title is required" }).min(1, "Title must not be empty").optional(),
    description: z.string().nullable().optional(),
    status: z.enum(["TODO", "DOING", "DONE"]).optional(),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
    due_date: z.string().nullable().optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field must be provided",
  });

export default { createTaskSchema, updateTaskSchema };
