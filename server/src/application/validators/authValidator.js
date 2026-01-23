import { z } from "zod";

export const registerSchema = z.object({
  email: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().email(),
  ),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().email(),
  ),
  password: z.string().min(8),
});

export default { registerSchema, loginSchema };
