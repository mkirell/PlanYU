import { DataTypes } from "sequelize";
import sequelize from "../../shared/config/database.js";

const Project = sequelize.define(
  "Project",
  {
    project_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
  },
  {
    tableName: "Project",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Project;
