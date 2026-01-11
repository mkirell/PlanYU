import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z
      .string({ required_error: "Name is required" })
      .min(1, "Name must not be empty")
  ),
  description: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().nullable().optional()
  ),
});

export const updateProjectSchema = z
  .object({
    name: z
      .preprocess(
        (val) => (typeof val === "string" ? val.trim() : val),
        z.string().min(1, "Name must not be empty")
      )
      .optional(),
    description: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().nullable().optional()
    ),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field must be provided",
  });

export default { createProjectSchema, updateProjectSchema };
