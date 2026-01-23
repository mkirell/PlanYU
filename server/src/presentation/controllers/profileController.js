import ProfileService from "../../application/services/profileService.js";
import { CreateProfileDto, UpdateProfileDto } from "../dtos/profileDto.js";
import {
  ValidationError,
  NotFoundError,
} from "../../shared/utils/errorHandler.js";

export async function getAllProfiles(req, res) {
  const profiles = await ProfileService.list();
  res.status(200).json(profiles);
}

export async function getProfileById(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    throw new ValidationError("Invalid profile ID");
  const profile = await ProfileService.get(id);
  if (!profile) throw new NotFoundError("Profile not found");
  res.status(200).json(profile);
}

export async function createProfile(req, res) {
  const dto = new CreateProfileDto(req.body);
  const created = await ProfileService.create(dto);
  res.status(201).json(created);
}

export async function updateProfile(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    throw new ValidationError("Invalid profile ID");
  const dto = new UpdateProfileDto(req.body);
  const updated = await ProfileService.update(id, dto);
  res.status(200).json(updated);
}

export async function deleteProfile(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    throw new ValidationError("Invalid profile ID");
  const deleted = await ProfileService.delete(id);
  res.status(200).json(deleted);
}
