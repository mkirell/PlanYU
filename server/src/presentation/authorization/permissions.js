const PERMISSIONS = {
  USERS: {
    READ: "users:read",
    CREATE: "users:create",
    UPDATE: "users:update",
    DELETE: "users:delete",
  },
  PROFILES: {
    READ: "profiles:read",
    CREATE: "profiles:create",
    UPDATE: "profiles:update",
    DELETE: "profiles:delete",
  },
  PROJECTS: {
    READ: "projects:read",
    CREATE: "projects:create",
    UPDATE: "projects:update",
    DELETE: "projects:delete",
  },
  STAGES: {
    READ: "stages:read",
    CREATE: "stages:create",
    UPDATE: "stages:update",
    DELETE: "stages:delete",
  },
  TASKS: {
    READ: "tasks:read",
    CREATE: "tasks:create",
    UPDATE: "tasks:update",
    DELETE: "tasks:delete",
  },
  USER_PROJECTS: {
    READ: "user-projects:read",
    CREATE: "user-projects:create",
    UPDATE: "user-projects:update",
    DELETE: "user-projects:delete",
  },
  USER_TASKS: {
    READ: "user-tasks:read",
    CREATE: "user-tasks:create",
    UPDATE: "user-tasks:update",
    DELETE: "user-tasks:delete",
  },
  AUTH: {
    MANAGE: "auth:manage",
  },
};

export default PERMISSIONS;
