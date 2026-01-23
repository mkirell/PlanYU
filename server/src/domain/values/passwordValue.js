import { ValidationError } from "../../shared/utils/errorHandler.js";

export class PasswordVO {
  constructor(password) {
    if (password === undefined || password === null) {
      this.value = undefined;
      return;
    }
    if (
      password.length < 8 ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      throw new ValidationError("Invalid password format");
    }
    this.value = password;
  }

  getValue() {
    return this.value;
  }

  equals(other) {
    return other instanceof PasswordVO && this.value === other.value;
  }
}
