import { z } from "zod";

const positiveInt = z.number().int().positive();

export const assignUserRoleValidator = z.object({
  user_id: positiveInt,
  role_id: positiveInt,
});

export const replaceUserRolesValidator = z.object({
  user_id: positiveInt,
  role_ids: z.array(positiveInt),
});

export default {
  assignUserRoleValidator,
  replaceUserRolesValidator,
};
