import PermissionService from "../services/permissionService.js";
import RoleService from "../services/roleService.js";
import UserRoleService from "../services/userRoleService.js";
import { UnauthorizedError } from "../../shared/errors/appError.js";

const normalizePermission = (permission) =>
  String(permission || "").trim().toLowerCase();

const permissionMatches = (grantedPermissions, requiredPermission) => {
  const required = normalizePermission(requiredPermission);
  if (!required) return false;

  if (grantedPermissions.has(required) || grantedPermissions.has("*:*")) {
    return true;
  }

  const [resource, action] = required.split(":");
  if (!resource || !action) return false;

  return (
    grantedPermissions.has(`${resource}:*`) ||
    grantedPermissions.has(`*:${action}`)
  );
};

const AuthorizationService = {
  async buildAuthContext(user) {
    await UserRoleService.ensureAtLeastOneRole(user.user_id, user.role || "GUEST");

    const dbRoles = await RoleService.listByUserId(user.user_id);
    const roles = [...new Set(dbRoles.map((role) => String(role.name || "").toUpperCase()))];

    const permissions = [...new Set(await PermissionService.listByUserId(user.user_id))];

    return {
      roles,
      permissions,
    };
  },

  async assertAuthorized({ requiredPermissions = [], auth }) {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const grantedPermissions = new Set(
      (auth?.permissions || []).map((perm) => normalizePermission(perm)),
    );

    const missing = requiredPermissions.filter(
      (required) => !permissionMatches(grantedPermissions, required),
    );

    if (missing.length > 0) {
      throw new UnauthorizedError("Insufficient permissions");
    }

    return true;
  },
};

export default AuthorizationService;