import { Profile } from "../models/index.js";
import { NotFoundError } from "../errors/index.js";

const ProfileRepository = {
  async findAll() {
    return Profile.findAll({ order: [["profile_id", "ASC"]] });
  },

  async findById(id) {
    const p = await Profile.findByPk(id);
    if (!p) throw new NotFoundError("Profile not found");
    return p;
  },

  async create(data) {
    return Profile.create(data);
  },

  async update(id, data) {
    const profile = await Profile.findByPk(id);
    if (!profile) throw new NotFoundError("Profile not found");
    await profile.update(data);
    return profile;
  },

  async delete(id) {
    const profile = await Profile.findByPk(id);
    if (!profile) throw new NotFoundError("Profile not found");
    const deletedProfile = profile.toJSON();
    await profile.destroy();
    return deletedProfile;
  },
};

export default ProfileRepository;
