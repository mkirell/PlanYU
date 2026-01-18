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
        err.response?.data?.error?.message || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (user, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/auth/login", user);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Login failed"
      );
    }
  }
);
