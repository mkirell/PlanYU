import ProjectRepository from "../../infrastructure/repositories/projectRepository.js";
import UserProjectRepository from "../../infrastructure/repositories/userProjectRepository.js";
import StatusService from "./statusService.js";
import ProjectEntity from "../../domain/entities/projectEntity.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/projectValidator.js";
import { ValidationError } from "../../shared/utils/errorHandler.js";

const ProjectService = {
  async list() {
    return ProjectRepository.findAll();
  },

  async get(id) {
    return ProjectRepository.findById(id);
  },

  async create(payload, user) {
    const parsed = createProjectSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid project data", parsed.error.errors);
    const entity = new ProjectEntity(parsed.data);
    const created = await ProjectRepository.create(entity.toCreateObject());

    await UserProjectRepository.create({
      user_id: user.user_id,
      project_id: created.project_id,
      role: "OWNER",
    });

    await StatusService.createDefaultStatuses(created.project_id);

    return created;
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
