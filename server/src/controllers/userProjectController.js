import { UserProject } from "../models/index.js";

async function getAllUserProjects(req, res) {
  try {
    const ups = await UserProject.findAll({ order: [["user_id", "ASC"]] });
    res.status(200).json({ data: ups });
  } catch (err) {
    console.error("Error fetching user-projects:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getUserProject(req, res) {
  const { user_id, project_id } = req.params;
  if (!user_id || isNaN(parseInt(user_id)) || !project_id || isNaN(parseInt(project_id)))
    return res.status(400).json({ warning: "Invalid IDs" });

  try {
    const up = await UserProject.findOne({ where: { user_id, project_id } });
    if (!up) return res.status(404).json({ warning: "UserProject not found" });
    res.status(200).json({ data: up });
  } catch (err) {
    console.error("Error fetching user-project:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createUserProject(req, res) {
  const { user_id, project_id, role } = req.body;
  if (!user_id || !project_id)
    return res.status(400).json({ warning: "User ID and Project ID required" });

  try {
    const up = await UserProject.create(req.body);
    res.status(201).json({ data: up });
  } catch (err) {
    console.error("Error creating user-project:", err);
    res.status(500).json({ error: err.message });
  }
}

async function updateUserProject(req, res) {
  const { user_id, project_id } = req.params;
  if (!user_id || !project_id)
    return res.status(400).json({ warning: "Invalid IDs" });

  try {
    const up = await UserProject.findOne({ where: { user_id, project_id } });
    if (!up) return res.status(404).json({ warning: "UserProject not found" });

    const updated = await up.update(req.body);
    res.status(200).json({ data: updated });
  } catch (err) {
    console.error("Error updating user-project:", err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteUserProject(req, res) {
  const { user_id, project_id } = req.params;
  if (!user_id || !project_id)
    return res.status(400).json({ warning: "Invalid IDs" });

  try {
    const up = await UserProject.findOne({ where: { user_id, project_id } });
    if (!up) return res.status(404).json({ warning: "UserProject not found" });

    await up.destroy();
    res.status(200).json({ message: `User ${user_id} removed from Project ${project_id}` });
  } catch (err) {
    console.error("Error deleting user-project:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export {
  getAllUserProjects,
  getUserProject,
  createUserProject,
  updateUserProject,
  deleteUserProject,
};
