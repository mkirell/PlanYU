import { Profile } from "../models/index.js";

async function getAllProfiles(req, res) {
  try {
    const profiles = await Profile.findAll({ order: [["profile_id", "ASC"]] });
    res.status(200).json({ data: profiles });
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
    const profile = await Profile.findByPk(id);
    if (!profile) return res.status(404).json({ warning: "Profile not found" });
    res.status(200).json({ data: profile });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createProfile(req, res) {
  const { user_id, full_name, avatar_url } = req.body;
  if (!user_id) return res.status(400).json({ warning: "User ID required" });

  try {
    const profile = await Profile.create(req.body);
    res.status(201).json({ data: profile });
  } catch (err) {
    console.error("Error creating profile:", err);
    res.status(500).json({ error: err.message });
  }
}

async function updateProfile(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    return res.status(400).json({ warning: "Invalid profile ID" });

  try {
    const profile = await Profile.findByPk(id);
    if (!profile) return res.status(404).json({ warning: "Profile not found" });

    const updated = await profile.update(req.body);
    res.status(200).json({ data: updated });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteProfile(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    return res.status(400).json({ warning: "Invalid profile ID" });

  try {
    const profile = await Profile.findByPk(id);
    if (!profile) return res.status(404).json({ warning: "Profile not found" });

    await profile.destroy();
    res.status(200).json({ message: `Profile ${id} deleted` });
  } catch (err) {
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
