export class RegisterDto {
  constructor({ email, password } = {}) {
    this.email = email;
    this.password = password;
  }
}

export class LoginDto {
  constructor({ email, password } = {}) {
    this.email = email;
    this.password = password;
  }
}

export default { RegisterDto, LoginDto };
