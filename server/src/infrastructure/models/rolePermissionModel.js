import { DataTypes } from "sequelize";
import sequelize from "../../infrastructure/database/sequelize.js";

const RolePermission = sequelize.define(
  "RolePermission",
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    permission_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    tableName: "Role_Permission",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default RolePermission;
