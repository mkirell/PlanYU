import User from "./User.js";
import Profile from "./Profile.js";
import Project from "./Project.js";
import Task from "./Task.js";
import UserProject from "./UserProject.js";
import UserTask from "./UserTask.js";

// 1:1 → User ↔ Profile
User.hasOne(Profile, { foreignKey: "user_id" });
Profile.belongsTo(User, { foreignKey: "user_id" });

// 1:N → Project ↔ Task
Project.hasMany(Task, { foreignKey: "project_id" });
Task.belongsTo(Project, { foreignKey: "project_id" });

// N:N → User ↔ Project via UserProject
User.belongsToMany(Project, {
  through: UserProject,
  foreignKey: "user_id",
  otherKey: "project_id",
});
Project.belongsToMany(User, {
  through: UserProject,
  foreignKey: "project_id",
  otherKey: "user_id",
});

// N:N → User ↔ Task via UserTask
User.belongsToMany(Task, {
  through: UserTask,
  foreignKey: "user_id",
  otherKey: "task_id",
});
Task.belongsToMany(User, {
  through: UserTask,
  foreignKey: "task_id",
  otherKey: "user_id",
});

export {
  User,
  Profile,
  Project,
  Task,
  UserProject,
  UserTask,
};
