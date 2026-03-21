import { Project } from "../models/index.js";
import { NotFoundError } from "../../shared/errors/appError.js";

const ProjectRepository = {
  async findAll() {
    return Project.findAll({ order: [["project_id", "ASC"]] });
  },

  async findById(id) {
    const p = await Project.findByPk(id);
    if (!p) throw new NotFoundError("Project not found");
    return p;
  },

  async create(data) {
    return Project.create(data);
  },

  async update(id, data) {
    const project = await Project.findByPk(id);
    if (!project) throw new NotFoundError("Project not found");
    await project.update(data);
    return project;
  },

  async delete(id) {
    const project = await Project.findByPk(id);
    if (!project) throw new NotFoundError("Project not found");
    const deletedProject = project.toJSON();
    await project.destroy();
    return deletedProject;
  },
};

export default ProjectRepository;
