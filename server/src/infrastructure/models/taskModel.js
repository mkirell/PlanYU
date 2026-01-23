import { DataTypes } from "sequelize";
import sequelize from "../../shared/config/database.js";

const Task = sequelize.define(
  "Task",
  {
    task_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    status: {
      type: DataTypes.ENUM("TODO", "DOING", "REVIEW", "DONE"),
      defaultValue: "TODO",
    },
    priority: {
      type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
      defaultValue: "MEDIUM",
    },
    due_date: { type: DataTypes.DATE },
  },
  {
    tableName: "Task",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default Task;
