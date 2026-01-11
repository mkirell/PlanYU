import ProfileRepository from "../repositories/profileRepository.js";
import UserRepository from "../repositories/userRepository.js";
import {
  createProfileSchema,
  updateProfileSchema,
} from "../validators/profileValidator.js";
import { ValidationError } from "../errors/index.js";

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
      throw new ValidationError(
        "Invalid profile data",
        parsed.error.errors.map((e) => e.message)
      );

    await UserRepository.findById(parsed.data.user_id);
    return ProfileRepository.create(parsed.data);
  },

  async update(id, payload) {
    const parsed = updateProfileSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError(
        "Invalid update data",
        parsed.error.errors.map((e) => e.message)
      );
    return ProfileRepository.update(id, parsed.data);
  },

  async delete(id) {
    return ProfileRepository.delete(id);
  },
};

export default ProfileService;
