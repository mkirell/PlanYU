import ProfileRepository from "../../infrastructure/repositories/profileRepository.js";
import UserRepository from "../../infrastructure/repositories/userRepository.js";
import ProfileEntity from "../../domain/entities/profileEntity.js";
import {
  createProfileSchema,
  updateProfileSchema,
} from "../validators/profileValidator.js";
import { ValidationError } from "../../shared/utils/errorHandler.js";

const ProfileService = {
  async list() {
    return ProfileRepository.findAll();
  },

  async get(id) {
    return ProfileRepository.findById(id);
  },

  async create(payload) {
    const parsed = createProfileSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid profile data", parsed.error.errors);
    const entity = new ProfileEntity(parsed.data);
    await UserRepository.findById(entity.user_id);
    return ProfileRepository.create(entity.toCreateObject());
  },

  async update(id, payload) {
    const parsed = updateProfileSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid profile data", parsed.error.errors);
    const entity = new ProfileEntity(parsed.data);
    return ProfileRepository.update(id, entity.toUpdateObject());
  },

  async delete(id) {
    return ProfileRepository.delete(id);
  },
};

export default ProfileService;
