import ProfileService from "../services/profileService.js";
import { AppError } from "../errors/index.js";

async function getAllProfiles(req, res) {
  try {
    const profiles = await ProfileService.list();
    res.status(200).json(profiles);
  } catch (err) {
    console.error("Error fetching profiles:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getProfileById(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    return res.status(400).json({ warning: "Invalid profile ID" });

  try {
    const profile = await ProfileService.get(id);
    res.status(200).json(profile);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createProfile(req, res) {
  try {
    const created = await ProfileService.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error creating profile:", err);
    res.status(500).json({ error: err.message });
  }
}

async function updateProfile(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    return res.status(400).json({ warning: "Invalid profile ID" });

  try {
    const updated = await ProfileService.update(id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error updating profile:", err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteProfile(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    return res.status(400).json({ warning: "Invalid profile ID" });

  try {
    const deleted = await ProfileService.delete(id);
    res.status(200).json(deleted);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error deleting profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
};
