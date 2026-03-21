import { z } from "zod";

const normalizeRoleName = (val) => {
  if (typeof val !== "string") return val;
  return val.trim().toUpperCase();
};

export const createRoleValidator = z.object({
  name: z.preprocess(normalizeRoleName, z.string().min(1)),
  description: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().nullable().optional(),
  ),
});

export const updateRoleValidator = z
  .object({
    name: z.preprocess(normalizeRoleName, z.string().min(1)).optional(),
    description: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().nullable().optional(),
    ),
  })
  .refine((obj) => Object.keys(obj).length > 0);

export default { createRoleValidator, updateRoleValidator };
