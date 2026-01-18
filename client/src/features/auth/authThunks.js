import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (user, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/auth/register", user);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Registration failed",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (user, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/auth/login", user);
      const data = res.data;
      if (data?.accessToken) {
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${data.accessToken}`;
      }
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Login failed",
      );
    }
  },
);

export const refreshUser = createAsyncThunk(
  "auth/refreshUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/auth/refresh", null);
      const data = res.data;
      if (data?.accessToken) {
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${data.accessToken}`;
      }
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Refresh failed",
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post("/api/auth/logout", null);
      delete axios.defaults.headers.common["Authorization"];
      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Logout failed",
      );
    }
  },
);
