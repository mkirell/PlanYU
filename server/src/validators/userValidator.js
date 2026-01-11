import { z } from "zod";

export const createUserSchema = z.object({
  email: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z
      .string({ required_error: "Email is required" })
      .email("Email must be valid")
  ),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

export const updateUserSchema = z
  .object({
    email: z
      .preprocess(
        (val) => (typeof val === "string" ? val.trim() : val),
        z.string().email("Email must be valid")
      )
      .optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field must be provided",
  });

export default { createUserSchema, updateUserSchema };
