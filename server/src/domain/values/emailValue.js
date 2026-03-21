import { ValidationError } from "../../shared/errors/appError.js";

export class EmailVO {
  constructor(email) {
    if (email === undefined || email === null) {
      this.value = undefined;
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ValidationError("Invalid email address");
    }
    this.value = email;
  }

  getValue() {
    return this.value;
  }

  equals(other) {
    return other instanceof EmailVO && this.value === other.value;
  }
}
