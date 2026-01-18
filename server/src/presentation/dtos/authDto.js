export class AuthRequestDto {
  constructor({ email, password } = {}) {
    this.email = email;
    this.password = password;
  }
}

export class AuthResponseDto {
  constructor(user = {}) {
    const source = user && user.dataValues ? user.dataValues : user;
    const { password_hash, token_version, ...safeUser } = source;
    Object.assign(this, safeUser);
  }
}

export default { AuthRequestDto, AuthResponseDto };
