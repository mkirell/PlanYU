import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProfiles = createAsyncThunk(
  "profiles/fetchProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/profiles");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch profiles"
      );
    }
  }
);

export const fetchProfileById = createAsyncThunk(
  "profiles/fetchProfileById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/profiles/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch profile"
      );
    }
  }
);

export const createProfile = createAsyncThunk(
  "profiles/createProfile",
  async (profile, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/profiles", profile);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to create profile"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profiles/updateProfile",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/api/profiles/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to update profile"
      );
    }
  }
);

export const deleteProfile = createAsyncThunk(
  "profiles/deleteProfile",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/profiles/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to delete profile"
      );
    }
  }
);
