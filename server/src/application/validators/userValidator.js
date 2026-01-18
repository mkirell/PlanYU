import { z } from "zod";

export const createUserSchema = z.object({
  email: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().email(),
  ),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "GUEST"]).optional(),
});

export const updateUserSchema = z
  .object({
    email: z
      .preprocess(
        (val) => (typeof val === "string" ? val.trim() : val),
        z.string().email(),
      )
      .optional(),
    password: z.string().min(6).optional(),
    role: z.enum(["ADMIN", "GUEST"]).optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0);

export default { createUserSchema, updateUserSchema };
