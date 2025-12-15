import { Project } from "../models/index.js";

async function getAllProjects(req, res) {
  try {
    const projects = await Project.findAll({ order: [["project_id", "ASC"]] });
    res.status(200).json({ data: projects });
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
    const project = await Project.findByPk(id);
    if (!project) return res.status(404).json({ warning: "Project not found" });
    res.status(200).json({ data: project });
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createProject(req, res) {
  const { name } = req.body;
  if (!name) return res.status(400).json({ warning: "Project name required" });

  try {
    const project = await Project.create(req.body);
    res.status(201).json({ data: project });
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ error: err.message });
  }
}

async function updateProject(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    return res.status(400).json({ warning: "Invalid project ID" });

  try {
    const project = await Project.findByPk(id);
    if (!project) return res.status(404).json({ warning: "Project not found" });

    const updated = await project.update(req.body);
    res.status(200).json({ data: updated });
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteProject(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    return res.status(400).json({ warning: "Invalid project ID" });

  try {
    const project = await Project.findByPk(id);
    if (!project) return res.status(404).json({ warning: "Project not found" });

    await project.destroy();
    res.status(200).json({ message: `Project ${id} deleted` });
  } catch (err) {
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
