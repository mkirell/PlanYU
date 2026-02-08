import { DataTypes } from "sequelize";
import sequelize from "../../shared/common/dbService.js";

const AuthToken = sequelize.define(
  "AuthToken",
  {
    auth_token_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("EMAIL_VERIFY", "LOGIN_2FA", "TRUST_DEVICE"),
      allowNull: false,
    },
    token_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "Auth_Token",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default AuthToken;
