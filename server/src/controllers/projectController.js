import ProjectService from "../services/projectService.js";
import { AppError } from "../errors/index.js";

async function getAllProjects(req, res) {
  try {
    const projects = await ProjectService.list();
    res.status(200).json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getProjectById(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    return res.status(400).json({ warning: "Invalid project ID" });

  try {
    const project = await ProjectService.get(id);
    res.status(200).json(project);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error fetching project:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createProject(req, res) {
  try {
    const created = await ProjectService.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error creating project:", err);
    res.status(500).json({ error: err.message });
  }
}

async function updateProject(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    return res.status(400).json({ warning: "Invalid project ID" });

  try {
    const updated = await ProjectService.update(id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error updating project:", err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteProject(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    return res.status(400).json({ warning: "Invalid project ID" });

  try {
    const deleted = await ProjectService.delete(id);
    res.status(200).json(deleted);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error deleting project:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
