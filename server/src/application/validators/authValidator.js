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

export const verifyCodeSchema = z
  .object({
    purpose: z.enum(["email", "login"]),
    email: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().email().optional(),
    ),
    challengeId: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().min(8).optional(),
    ),
    code: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().length(6),
    ),
    rememberDevice: z.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.purpose === "email" && !value.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email required for email verification",
        path: ["email"],
      });
    }
    if (value.purpose === "login" && !value.challengeId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Challenge ID required for login verification",
        path: ["challengeId"],
      });
    }
  });

export const resendCodeSchema = z
  .object({
    purpose: z.enum(["email", "login"]),
    email: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().email().optional(),
    ),
    challengeId: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().min(8).optional(),
    ),
  })
  .superRefine((value, ctx) => {
    if (value.purpose === "email" && !value.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email required to resend verification code",
        path: ["email"],
      });
    }
    if (value.purpose === "login" && !value.challengeId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Challenge ID required to resend login code",
        path: ["challengeId"],
      });
    }
  });

export default {
  registerSchema,
  loginSchema,
  verifyCodeSchema,
  resendCodeSchema,
};
