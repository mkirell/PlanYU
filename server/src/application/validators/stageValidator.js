import { z } from "zod";

const normalizeName = (val) => {
  if (typeof val !== "string") return val;
  const cleaned = val.trim().replace(/\s+/g, " ").toLowerCase();
  if (!cleaned) return "";
  return cleaned.replace(/(^|\s)\S/g, (c) => c.toUpperCase());
};

export const createStageValidator = z.object({
  project_id: z.number().int().positive(),
  name: z.preprocess(normalizeName, z.string().min(1)),
  description: z.preprocess((val) => {
    if (typeof val !== "string") return val;
    const trimmed = val.trim();
    return trimmed === "" ? null : trimmed;
  }, z.string().nullable().optional()),
  status: z.preprocess(
    (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
    z.enum(["TODO", "DOING", "REVIEW", "DONE"]),
  ),
  icon: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().nullable().optional(),
  ),
  color: z.preprocess(
    (val) => {
      if (typeof val !== "string") return val;
      const trimmed = val.trim();
      return trimmed === "" ? null : trimmed;
    },
    z
      .string()
      .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
      .nullable()
      .optional(),
  ),
  sort_order: z.number().int().min(0).optional(),
});

export const updateStageValidator = z
  .object({
    name: z.preprocess(normalizeName, z.string().min(1)).optional(),
    description: z.preprocess((val) => {
      if (typeof val !== "string") return val;
      const trimmed = val.trim();
      return trimmed === "" ? null : trimmed;
    }, z.string().nullable().optional()),
    status: z
      .preprocess(
        (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
        z.enum(["TODO", "DOING", "REVIEW", "DONE"]),
      )
      .optional(),
    icon: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().nullable().optional(),
    ),
    color: z.preprocess(
      (val) => {
        if (typeof val !== "string") return val;
        const trimmed = val.trim();
        return trimmed === "" ? null : trimmed;
      },
      z
        .string()
        .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
        .nullable()
        .optional(),
    ),
    sort_order: z.number().int().min(0).optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0);

export default { createStageValidator, updateStageValidator };
