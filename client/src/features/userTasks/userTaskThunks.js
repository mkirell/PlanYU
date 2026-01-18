import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserTasks = createAsyncThunk(
  "userTasks/fetchUserTasks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/user-tasks");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch user tasks"
      );
    }
  }
);

export const fetchUserTask = createAsyncThunk(
  "userTasks/fetchUserTask",
  async ({ user_id, task_id }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/user-tasks/${user_id}/${task_id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch user task"
      );
    }
  }
);

export const createUserTask = createAsyncThunk(
  "userTasks/createUserTask",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/user-tasks", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to create user task"
      );
    }
  }
);

export const updateUserTask = createAsyncThunk(
  "userTasks/updateUserTask",
  async ({ user_id, task_id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `/api/user-tasks/${user_id}/${task_id}`,
        data
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to update user task"
      );
    }
  }
);

export const deleteUserTask = createAsyncThunk(
  "userTasks/deleteUserTask",
  async ({ user_id, task_id }, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/user-tasks/${user_id}/${task_id}`);
      return { user_id, task_id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to delete user task"
      );
    }
  }
);
