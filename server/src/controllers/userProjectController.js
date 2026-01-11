import UserProjectService from "../services/userProjectService.js";
import { ValidationError, NotFoundError } from "../errors/errors.js";

export async function getAllUserProjects(req, res) {
  const ups = await UserProjectService.list();
  res.status(200).json(ups);
}

export async function getUserProjectByIds(req, res) {
  const { user_id, project_id } = req.params;
  if (
    !user_id ||
    isNaN(parseInt(user_id)) ||
    !project_id ||
    isNaN(parseInt(project_id))
  )
    throw new ValidationError("Invalid IDs");

  const up = await UserProjectService.get(user_id, project_id);
  if (!up) throw new NotFoundError("UserProject not found");
  res.status(200).json(up);
}

export async function createUserProject(req, res) {
  const up = await UserProjectService.create(req.body);
  res.status(201).json(up);
}

export async function updateUserProject(req, res) {
  const { user_id, project_id } = req.params;
  if (
    !user_id ||
    isNaN(parseInt(user_id)) ||
    !project_id ||
    isNaN(parseInt(project_id))
  )
    throw new ValidationError("Invalid IDs");

  const updated = await UserProjectService.update(
    user_id,
    project_id,
    req.body
  );
  res.status(200).json(updated);
}

export async function deleteUserProject(req, res) {
  const { user_id, project_id } = req.params;
  if (
    !user_id ||
    isNaN(parseInt(user_id)) ||
    !project_id ||
    isNaN(parseInt(project_id))
  )
    throw new ValidationError("Invalid IDs");

  const deleted = await UserProjectService.delete(user_id, project_id);
  res.status(200).json(deleted);
}
