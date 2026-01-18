export class CreateProfileDto {
  constructor({ user_id, full_name, avatar_url } = {}) {
    this.user_id = user_id;
    this.full_name = full_name;
    this.avatar_url = avatar_url;
  }
}

export class UpdateProfileDto {
  constructor({ full_name, avatar_url } = {}) {
    this.full_name = full_name;
    this.avatar_url = avatar_url;
  }
}

export default { CreateProfileDto, UpdateProfileDto };
