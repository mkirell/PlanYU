export class ProfileEntity {
  constructor({ profile_id, user_id, full_name, avatar_url } = {}) {
    this.profile_id = profile_id;
    this.user_id = user_id;
    this.full_name = full_name;
    this.avatar_url = avatar_url;
  }

  toCreateObject() {
    const out = {};
    if (this.user_id !== undefined) out.user_id = this.user_id;
    if (this.full_name !== undefined) out.full_name = this.full_name;
    if (this.avatar_url !== undefined) out.avatar_url = this.avatar_url;
    return out;
  }

  toUpdateObject() {
    const out = {};
    if (this.full_name !== undefined) out.full_name = this.full_name;
    if (this.avatar_url !== undefined) out.avatar_url = this.avatar_url;
    return out;
  }
}

export default ProfileEntity;
