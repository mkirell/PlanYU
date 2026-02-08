export class UserEntity {
  constructor({
    id,
    email,
    username,
    password,
    password_hash,
    role,
    token_version,
    verified_at,
  } = {}) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.password_hash = password_hash;
    this.role = role;
    this.token_version = token_version;
    this.verified_at = verified_at;
  }

  toCreateObject() {
    const out = {};
    if (this.email !== undefined) out.email = this.email;
    if (this.password_hash !== undefined)
      out.password_hash = this.password_hash;
    if (this.role !== undefined) out.role = this.role;
    if (this.token_version !== undefined)
      out.token_version = this.token_version;
    if (this.verified_at !== undefined) out.verified_at = this.verified_at;
    return out;
  }

  toUpdateObject() {
    const out = {};
    if (this.email !== undefined) out.email = this.email;
    if (this.username !== undefined) out.username = this.username;
    if (this.password_hash !== undefined)
      out.password_hash = this.password_hash;
    if (this.role !== undefined) out.role = this.role;
    if (this.token_version !== undefined)
      out.token_version = this.token_version;
    if (this.verified_at !== undefined) out.verified_at = this.verified_at;
    return out;
  }
}

export default UserEntity;
