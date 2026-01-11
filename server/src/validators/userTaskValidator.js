import { z } from "zod";

export const createUserTaskSchema = z.object({
  user_id: z.number({ required_error: "User ID is required" }).int().positive(),
  task_id: z.number({ required_error: "Task ID is required" }).int().positive(),
});

export const updateUserTaskSchema = z.object({}).passthrough();

export default { createUserTaskSchema, updateUserTaskSchema };
