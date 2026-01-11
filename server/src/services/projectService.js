import ProjectRepository from "../repositories/projectRepository.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/projectValidator.js";
import { ValidationError } from "../errors/index.js";

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
      throw new ValidationError(
        "Invalid project data",
        parsed.error.errors.map((e) => e.message)
      );
    return ProjectRepository.create(parsed.data);
  },

  async update(id, payload) {
    const parsed = updateProjectSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError(
        "Invalid update data",
        parsed.error.errors.map((e) => e.message)
      );
    return ProjectRepository.update(id, parsed.data);
  },

  async delete(id) {
    return ProjectRepository.delete(id);
  },
};

export default ProjectService;
