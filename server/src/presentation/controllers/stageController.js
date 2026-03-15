import StageService from "../../application/services/stageService.js";
import { CreateStageDto, UpdateStageDto } from "../dtos/stageDto.js";
import { ValidationError, NotFoundError } from "../../shared/utils/errorHandler.js";

export async function getAllStages(req, res) {
  const projectId = req.query?.project_id
    ? Number(req.query.project_id)
    : undefined;
  if (req.query?.project_id && Number.isNaN(projectId))
    throw new ValidationError("Invalid project ID");

  const stages = await StageService.list({
    project_id: projectId,
  });
  res.status(200).json(stages);
}

export async function getStageById(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    throw new ValidationError("Invalid stage ID");
  const stage = await StageService.get(id);
  if (!stage) throw new NotFoundError("Stage not found");
  res.status(200).json(stage);
}

export async function createStage(req, res) {
  const dto = new CreateStageDto(req.body);
  const created = await StageService.create(dto);
  res.status(201).json(created);
}

export async function updateStage(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    throw new ValidationError("Invalid stage ID");
  const dto = new UpdateStageDto(req.body);
  const updated = await StageService.update(id, dto);
  res.status(200).json(updated);
}

export async function deleteStage(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    throw new ValidationError("Invalid stage ID");
  const deleted = await StageService.delete(id);
  res.status(200).json(deleted);
}
