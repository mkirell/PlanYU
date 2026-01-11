import { User } from "../models/index.js";
import { NotFoundError, ConflictError } from "../errors/errors.js";

const UserRepository = {
  async findAll() {
    return User.findAll({ order: [["user_id", "ASC"]] });
  },

  async findById(id) {
    const u = await User.findByPk(id);
    if (!u) throw new NotFoundError("User not found");
    return u;
  },

  async findByEmail(email) {
    return User.findOne({ where: { email } });
  },

  async create(data) {
    const existing = await this.findByEmail(data.email);
    if (existing) throw new ConflictError("Email already exists");
    return User.create(data);
  },

  async update(id, data) {
    const user = await User.findByPk(id);
    if (!user) throw new NotFoundError("User not found");
    await user.update(data);
    return user;
  },

  async delete(id) {
    const user = await User.findByPk(id);
    if (!user) throw new NotFoundError("User not found");
    const deletedUser = user.toJSON();
    await user.destroy();
    return deletedUser;
  },
};

export default UserRepository;
