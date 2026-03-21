import { Role, User } from "../models/index.js";
import { NotFoundError } from "../../shared/errors/appError.js";

const RoleRepository = {
  async findAll() {
    return Role.findAll({ order: [["name", "ASC"]] });
  },

  async findById(role_id) {
    const role = await Role.findByPk(role_id);
    if (!role) throw new NotFoundError("Role not found");
    return role;
  },

  async findByName(name) {
    return Role.findOne({ where: { name: String(name || "").toUpperCase() } });
  },

  async findAllByUserId(user_id) {
    return Role.findAll({
      attributes: ["role_id", "name", "description"],
      include: [
        {
          model: User,
          attributes: [],
          through: { attributes: [] },
          where: { user_id },
          required: true,
        },
      ],
      order: [["name", "ASC"]],
    });
  },

  async create(data) {
    return Role.create(data);
  },

  async update(role_id, data) {
    const role = await this.findById(role_id);
    await role.update(data);
    return role;
  },

  async delete(role_id) {
    const role = await this.findById(role_id);
    const snapshot = role.toJSON();
    await role.destroy();
    return snapshot;
  },
};

export default RoleRepository;
