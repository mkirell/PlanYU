import { DataTypes } from "sequelize";
import sequelize from "../../infrastructure/database/sequelize.js";

const UserRole = sequelize.define(
  "UserRole",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    tableName: "User_Role",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default UserRole;
