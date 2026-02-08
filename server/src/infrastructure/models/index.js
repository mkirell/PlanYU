import User from "./userModel.js";
import Profile from "./profileModel.js";
import Project from "./projectModel.js";
import Status from "./statusModel.js";
import Task from "./taskModel.js";
import UserProject from "./userProjectModel.js";
import UserTask from "./userTaskModel.js";
import AuthToken from "./authTokenModel.js";

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

// 1:N → Project ↔ Status
Project.hasMany(Status, {
  foreignKey: "project_id",
  onDelete: "CASCADE",
  hooks: true,
});
Status.belongsTo(Project, { foreignKey: "project_id", onDelete: "CASCADE" });

// 1:N → Status ↔ Task
Status.hasMany(Task, {
  foreignKey: "status_id",
  onDelete: "RESTRICT",
});
Task.belongsTo(Status, { foreignKey: "status_id", onDelete: "RESTRICT" });

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

// 1:N → User ↔ AuthToken
User.hasMany(AuthToken, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  hooks: true,
});
AuthToken.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

export {
  User,
  Profile,
  Project,
  Status,
  Task,
  UserProject,
  UserTask,
  AuthToken,
};
