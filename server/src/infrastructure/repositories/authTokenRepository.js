import { AuthToken } from "../models/index.js";
import { NotFoundError } from "../../shared/utils/errorHandler.js";

const AuthTokenRepository = {
  async create(data) {
    return AuthToken.create(data);
  },

  async findByTokenId(token_id) {
    return AuthToken.findOne({ where: { token_id } });
  },

  async findByTokenHash(token_hash, type) {
    return AuthToken.findOne({ where: { token_hash, type } });
  },

  async findLatestActiveByUserAndType(user_id, type) {
    return AuthToken.findOne({
      where: { user_id, type, used_at: null },
      order: [["auth_token_id", "DESC"]],
    });
  },

  async markUsed(auth_token_id) {
    const token = await AuthToken.findByPk(auth_token_id);
    if (!token) throw new NotFoundError("Auth token not found");
    await token.update({ used_at: new Date() });
    return token;
  },

  async revokeByTokenHash(token_hash, type) {
    const token = await AuthToken.findOne({ where: { token_hash, type } });
    if (!token) return null;
    await token.update({ used_at: new Date() });
    return token;
  },
};

export default AuthTokenRepository;
