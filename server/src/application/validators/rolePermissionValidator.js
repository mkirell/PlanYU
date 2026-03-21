import { z } from "zod";

const positiveInt = z.number().int().positive();

export const assignRolePermissionValidator = z.object({
  role_id: positiveInt,
  permission_id: positiveInt,
});

export const replaceRolePermissionsValidator = z.object({
  role_id: positiveInt,
  permission_ids: z.array(positiveInt),
});

export default {
  assignRolePermissionValidator,
  replaceRolePermissionsValidator,
};
