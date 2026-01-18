import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserProjects = createAsyncThunk(
  "userProjects/fetchUserProjects",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/user-projects");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch user projects"
      );
    }
  }
);

export const fetchUserProject = createAsyncThunk(
  "userProjects/fetchUserProject",
  async ({ user_id, project_id }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `/api/user-projects/${user_id}/${project_id}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch user project"
      );
    }
  }
);

export const createUserProject = createAsyncThunk(
  "userProjects/createUserProject",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/user-projects", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to create user project"
      );
    }
  }
);

export const updateUserProject = createAsyncThunk(
  "userProjects/updateUserProject",
  async ({ user_id, project_id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `/api/user-projects/${user_id}/${project_id}`,
        data
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to update user project"
      );
    }
  }
);

export const deleteUserProject = createAsyncThunk(
  "userProjects/deleteUserProject",
  async ({ user_id, project_id }, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/user-projects/${user_id}/${project_id}`);
      return { user_id, project_id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to delete user project"
      );
    }
  }
);
