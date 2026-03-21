import { Auth } from "../models/index.js";
import { NotFoundError } from "../../shared/errors/appError.js";

const AuthRepository = {
  async create(data) {
    return Auth.create(data);
  },

  async findByTokenId(token_id) {
    return Auth.findOne({ where: { token_id } });
  },

  async findByTokenHash(token_hash, type) {
    return Auth.findOne({ where: { token_hash, type } });
  },

  async findLatestActiveByUserAndType(user_id, type) {
    return Auth.findOne({
      where: { user_id, type, used_at: null },
      order: [["auth_id", "DESC"]],
    });
  },

  async markUsed(auth_id) {
    const auth = await Auth.findByPk(auth_id);
    if (!auth) throw new NotFoundError("Auth not found");
    await auth.update({ used_at: new Date() });
    return auth;
  },

  async revokeByTokenHash(token_hash, type) {
    const auth = await Auth.findOne({ where: { token_hash, type } });
    if (!auth) return null;
    await auth.update({ used_at: new Date() });
    return auth;
  },

  async revokeAllActiveByUserAndType(user_id, type) {
    return Auth.update(
      { used_at: new Date() },
      { where: { user_id, type, used_at: null } },
    );
  },
};

export default AuthRepository;
