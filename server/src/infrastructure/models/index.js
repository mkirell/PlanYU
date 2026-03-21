import User from "./userModel.js";
import Profile from "./profileModel.js";
import Project from "./projectModel.js";
import Stage from "./stageModel.js";
import Task from "./taskModel.js";
import UserProject from "./userProjectModel.js";
import UserTask from "./userTaskModel.js";
import Auth from "./authModel.js";
import Role from "./roleModel.js";
import Permission from "./permissionModel.js";
import UserRole from "./userRoleModel.js";
import RolePermission from "./rolePermissionModel.js";

// 1:1 → User ↔ Profile
User.hasOne(Profile, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  hooks: true,
});
Profile.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

// 1:N → Project ↔ Task
Project.hasMany(Task, {
  foreignKey: "project_id",
  onDelete: "CASCADE",
  hooks: true,
});
Task.belongsTo(Project, { foreignKey: "project_id", onDelete: "CASCADE" });

// 1:N → Project ↔ Stage
Project.hasMany(Stage, {
  foreignKey: "project_id",
  onDelete: "CASCADE",
  hooks: true,
});
Stage.belongsTo(Project, { foreignKey: "project_id", onDelete: "CASCADE" });

// 1:N → Stage ↔ Task
Stage.hasMany(Task, {
  foreignKey: "stage_id",
  onDelete: "RESTRICT",
});
Task.belongsTo(Stage, { foreignKey: "stage_id", onDelete: "RESTRICT" });

// N:N → User ↔ Project via UserProject
User.belongsToMany(Project, {
  through: UserProject,
  foreignKey: "user_id",
  otherKey: "project_id",
  constraints: true,
  onDelete: "CASCADE",
});
Project.belongsToMany(User, {
  through: UserProject,
  foreignKey: "project_id",
  otherKey: "user_id",
  constraints: true,
  onDelete: "CASCADE",
});

// N:N → User ↔ Task via UserTask
User.belongsToMany(Task, {
  through: UserTask,
  foreignKey: "user_id",
  otherKey: "task_id",
  constraints: true,
  onDelete: "CASCADE",
});
Task.belongsToMany(User, {
  through: UserTask,
  foreignKey: "task_id",
  otherKey: "user_id",
  constraints: true,
  onDelete: "CASCADE",
});

// 1:N → User ↔ Auth
User.hasMany(Auth, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  hooks: true,
});
Auth.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

// N:N → User ↔ Role via UserRole
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "user_id",
  otherKey: "role_id",
  constraints: true,
  onDelete: "CASCADE",
});
Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "role_id",
  otherKey: "user_id",
  constraints: true,
  onDelete: "CASCADE",
});

// N:N → Role ↔ Permission via RolePermission
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "role_id",
  otherKey: "permission_id",
  constraints: true,
  onDelete: "CASCADE",
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permission_id",
  otherKey: "role_id",
  constraints: true,
  onDelete: "CASCADE",
});

export {
  User,
  Profile,
  Project,
  Stage,
  Task,
  UserProject,
  UserTask,
  Auth,
  Role,
  Permission,
  UserRole,
  RolePermission,
};

