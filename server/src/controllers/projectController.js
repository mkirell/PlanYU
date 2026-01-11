import ProjectService from "../services/projectService.js";
import { ValidationError, NotFoundError } from "../errors/errors.js";

export async function getAllProjects(req, res) {
  const projects = await ProjectService.list();
  res.status(200).json(projects);
}

export async function getProjectById(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) throw new ValidationError("Invalid project ID");
  const project = await ProjectService.get(id);
  if (!project) throw new NotFoundError("Project not found");
  res.status(200).json(project);
}

export async function createProject(req, res) {
  const created = await ProjectService.create(req.body);
  res.status(201).json(created);
}

export async function updateProject(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) throw new ValidationError("Invalid project ID");
  const updated = await ProjectService.update(id, req.body);
  res.status(200).json(updated);
}

export async function deleteProject(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) throw new ValidationError("Invalid project ID");
  const deleted = await ProjectService.delete(id);
  res.status(200).json(deleted);
}
