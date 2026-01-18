import ProjectRepository from "../../infrastructure/repositories/projectRepository.js";
import ProjectEntity from "../../domain/entities/projectEntity.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/projectValidator.js";
import { ValidationError } from "../../shared/utils/errors.js";

const ProjectService = {
  async list() {
    return ProjectRepository.findAll();
  },

  async get(id) {
    return ProjectRepository.findById(id);
  },

  async create(payload) {
    const parsed = createProjectSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid project data", parsed.error.errors);
    const entity = new ProjectEntity(parsed.data);
    return ProjectRepository.create(entity.toCreateObject());
  },

  async update(id, payload) {
    const parsed = updateProjectSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid project data", parsed.error.errors);
    const entity = new ProjectEntity(parsed.data);
    return ProjectRepository.update(id, entity.toUpdateObject());
  },

  async delete(id) {
    return ProjectRepository.delete(id);
  },
};

export default ProjectService;
