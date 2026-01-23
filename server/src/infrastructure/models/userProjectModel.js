import { DataTypes } from "sequelize";
import sequelize from "../../shared/core/dbService.js";

const UserProject = sequelize.define(
  "UserProject",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM("OWNER", "MEMBER"),
      defaultValue: "MEMBER",
      allowNull: false,
    },
  },
  {
    tableName: "User_Project",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default UserProject;
