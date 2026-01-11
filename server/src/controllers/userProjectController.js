import UserProjectService from "../services/userProjectService.js";
import { AppError } from "../errors/index.js";

async function getAllUserProjects(req, res) {
  try {
    const ups = await UserProjectService.list();
    res.status(200).json(ups);
  } catch (err) {
    console.error("Error fetching user-projects:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getUserProjectByIds(req, res) {
  const { user_id, project_id } = req.params;
  if (
    !user_id ||
    isNaN(parseInt(user_id)) ||
    !project_id ||
    isNaN(parseInt(project_id))
  )
    return res.status(400).json({ warning: "Invalid IDs" });

  try {
    const up = await UserProjectService.get(user_id, project_id);
    res.status(200).json(up);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error fetching user-project:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createUserProject(req, res) {
  try {
    const up = await UserProjectService.create(req.body);
    res.status(201).json(up);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error creating user-project:", err);
    res.status(500).json({ error: err.message });
  }
}

async function updateUserProject(req, res) {
  const { user_id, project_id } = req.params;
  if (
    !user_id ||
    isNaN(parseInt(user_id)) ||
    !project_id ||
    isNaN(parseInt(project_id))
  )
    return res.status(400).json({ warning: "Invalid IDs" });

  try {
    const updated = await UserProjectService.update(
      user_id,
      project_id,
      req.body
    );
    res.status(200).json(updated);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error updating user-project:", err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteUserProject(req, res) {
  const { user_id, project_id } = req.params;
  if (
    !user_id ||
    isNaN(parseInt(user_id)) ||
    !project_id ||
    isNaN(parseInt(project_id))
  )
    return res.status(400).json({ warning: "Invalid IDs" });

  try {
    const deleted = await UserProjectService.delete(user_id, project_id);
    res.status(200).json(deleted);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error deleting user-project:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export {
  getAllUserProjects,
  getUserProjectByIds,
  createUserProject,
  updateUserProject,
  deleteUserProject,
};
