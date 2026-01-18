export class CreateUserDto {
  constructor({ email, password, username } = {}) {
    this.email = email;
    this.password = password;
    this.username = username;
  }
}

export class UpdateUserDto {
  constructor({ email, password, username } = {}) {
    this.email = email;
    this.password = password;
    this.username = username;
  }
}

export default { CreateUserDto, UpdateUserDto };
