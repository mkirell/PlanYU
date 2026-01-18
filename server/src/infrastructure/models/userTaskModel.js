import { DataTypes } from "sequelize";
import sequelize from "../../shared/config/database.js";

const UserTask = sequelize.define(
  "UserTask",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    task_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM("ASSIGNEE", "REVIEWER"),
      allowNull: false,
      defaultValue: "ASSIGNEE",
    },
  },
  {
    tableName: "User_Task",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default UserTask;
