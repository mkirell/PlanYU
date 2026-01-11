import { z } from "zod";

export const registerSchema = z.object({
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

export const loginSchema = z.object({
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

export default { registerSchema, loginSchema };
