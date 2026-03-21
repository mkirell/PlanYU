import { z } from "zod";

export const registerValidator = z.object({
  email: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().email(),
  ),
  password: z.string().min(8),
});

export const loginValidator = z.object({
  email: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().email(),
  ),
  password: z.string().min(8),
});

export const verifyCodeValidator = z
  .object({
    purpose: z.enum(["register", "login"]),
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
    if (value.purpose === "register" && !value.email) {
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

export const resendCodeValidator = z
  .object({
    purpose: z.enum(["register", "login"]),
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
    if (value.purpose === "register" && !value.email) {
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
  registerValidator,
  loginValidator,
  verifyCodeValidator,
  resendCodeValidator,
};
