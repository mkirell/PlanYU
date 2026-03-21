import RoleEntity from "../../domain/entities/roleEntity.js";
import RoleRepository from "../../infrastructure/repositories/roleRepository.js";
import {
  createRoleValidator,
  updateRoleValidator,
} from "../validators/roleValidator.js";
import { ValidationError } from "../../shared/errors/appError.js";

const RoleService = {
  async list() {
    return RoleRepository.findAll();
  },

  async get(role_id) {
    return RoleRepository.findById(role_id);
  },

  async getByName(name) {
    return RoleRepository.findByName(name);
  },

  async listByUserId(user_id) {
    return RoleRepository.findAllByUserId(user_id);
  },

  async create(payload) {
    const parsed = createRoleValidator.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid role data", parsed.error.errors);

    const entity = new RoleEntity(parsed.data);
    return RoleRepository.create(entity.toCreateObject());
  },

  async update(role_id, payload) {
    const parsed = updateRoleValidator.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid role data", parsed.error.errors);

    const entity = new RoleEntity(parsed.data);
    return RoleRepository.update(role_id, entity.toUpdateObject());
  },

  async delete(role_id) {
    return RoleRepository.delete(role_id);
  },
};

export default RoleService;
