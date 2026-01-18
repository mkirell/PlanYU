import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/projects");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch projects"
      );
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/projects/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch project"
      );
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (project, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/projects", project);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to create project"
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/api/projects/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to update project"
      );
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/projects/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to delete project"
      );
    }
  }
);
