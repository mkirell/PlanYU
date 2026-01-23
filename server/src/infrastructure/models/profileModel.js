import { DataTypes } from "sequelize";
import sequelize from "../../shared/core/dbService.js";

const Profile = sequelize.define(
  "Profile",
  {
    profile_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    full_name: { type: DataTypes.STRING },
    avatar_url: { type: DataTypes.STRING },
  },
  {
    tableName: "Profile",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Profile;
