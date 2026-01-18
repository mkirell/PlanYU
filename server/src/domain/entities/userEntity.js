export class UserEntity {
  constructor({ id, email, username, password, password_hash } = {}) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.password_hash = password_hash;
  }

  toCreateObject() {
    const out = {};
    if (this.email !== undefined) out.email = this.email;
    if (this.password_hash !== undefined)
      out.password_hash = this.password_hash;
    return out;
  }

  toUpdateObject() {
    const out = {};
    if (this.email !== undefined) out.email = this.email;
    if (this.username !== undefined) out.username = this.username;
    if (this.password_hash !== undefined)
      out.password_hash = this.password_hash;
    return out;
  }
}

export default UserEntity;
