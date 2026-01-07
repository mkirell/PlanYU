import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (user) => {
    const res = await axios.post("/api/auth/register", user);
    return res.data.data;
  }
);

export const loginUser = createAsyncThunk("auth/loginUser", async (user) => {
  const res = await axios.post("/api/auth/login", user);
  return res.data.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: { data: null, status: "idle", error: null },
  reducers: {
    logoutUser(state) {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
