import { z } from "zod";

const normalizeResource = (val) => {
  if (typeof val !== "string") return val;
  return val.trim().toLowerCase();
};

const normalizeAction = (val) => {
  if (typeof val !== "string") return val;
  return val.trim().toLowerCase();
};

export const createPermissionValidator = z.object({
  resource: z.preprocess(normalizeResource, z.string().min(1)),
  action: z.preprocess(normalizeAction, z.string().min(1)),
  description: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().nullable().optional(),
  ),
});

export const updatePermissionValidator = z
  .object({
    resource: z.preprocess(normalizeResource, z.string().min(1)).optional(),
    action: z.preprocess(normalizeAction, z.string().min(1)).optional(),
    description: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().nullable().optional(),
    ),
  })
  .refine((obj) => Object.keys(obj).length > 0);

export default {
  createPermissionValidator,
  updatePermissionValidator,
};
