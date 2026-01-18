import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.preprocess((val) => {
    if (typeof val !== "string") return val;
    return val.trim().replace(/\b\w/g, (c) => c.toUpperCase());
  }, z.string().min(1)),
  description: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().nullable().optional(),
  ),
});

export const updateProjectSchema = z
  .object({
    name: z
      .preprocess((val) => {
        if (typeof val !== "string") return val;
        return val.trim().replace(/\b\w/g, (c) => c.toUpperCase());
      }, z.string().min(1))
      .optional(),
    description: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().nullable().optional(),
    ),
  })
  .refine((obj) => Object.keys(obj).length > 0);

export default { createProjectSchema, updateProjectSchema };
