export class CreateUserDto {
  constructor({ email, password, username } = {}) {
    this.email = email;
    this.password = password;
    this.username = username;
    this.role = undefined;
  }
}

export class UpdateUserDto {
  constructor({ email, password, username } = {}) {
    this.email = email;
    this.password = password;
    this.username = username;
    this.role = undefined;
  }
}

export class UserResponseDto {
  constructor(user = {}) {
    const source = user && user.dataValues ? user.dataValues : user;
    const { password_hash, token_version, ...safeUser } = source;
    Object.assign(this, safeUser);
  }
}

export default { CreateUserDto, UpdateUserDto, UserResponseDto };
