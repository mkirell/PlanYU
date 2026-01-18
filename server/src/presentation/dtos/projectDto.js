export class CreateProjectDto {
  constructor({ name, description } = {}) {
    this.name = name;
    this.description = description;
  }
}

export class UpdateProjectDto {
  constructor({ name, description } = {}) {
    this.name = name;
    this.description = description;
  }
}

export default { CreateProjectDto, UpdateProjectDto };
