import StatusService from "../../application/services/statusService.js";
import { CreateStatusDto, UpdateStatusDto } from "../dtos/statusDto.js";
import { ValidationError, NotFoundError } from "../../shared/utils/errorHandler.js";

export async function getAllStatuses(req, res) {
  const projectId = req.query?.project_id
    ? Number(req.query.project_id)
    : undefined;
  if (req.query?.project_id && Number.isNaN(projectId))
    throw new ValidationError("Invalid project ID");

  const statuses = await StatusService.list({
    project_id: projectId,
  });
  res.status(200).json(statuses);
}

export async function getStatusById(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    throw new ValidationError("Invalid status ID");
  const status = await StatusService.get(id);
  if (!status) throw new NotFoundError("Status not found");
  res.status(200).json(status);
}

export async function createStatus(req, res) {
  const dto = new CreateStatusDto(req.body);
  const created = await StatusService.create(dto);
  res.status(201).json(created);
}

export async function updateStatus(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    throw new ValidationError("Invalid status ID");
  const dto = new UpdateStatusDto(req.body);
  const updated = await StatusService.update(id, dto);
  res.status(200).json(updated);
}

export async function deleteStatus(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    throw new ValidationError("Invalid status ID");
  const deleted = await StatusService.delete(id);
  res.status(200).json(deleted);
}
