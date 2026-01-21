import { createSlice } from "@reduxjs/toolkit";
import { registerUser, loginUser, refreshUser, logoutUser } from "./authThunks";

const authSlice = createSlice({
  name: "auth",
  initialState: { data: null, status: "idle", error: null },
  reducers: {
    clearError(state) {
      state.error = null;
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
        state.error = action.payload;
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
        state.error = action.payload;
      })
      .addCase(refreshUser.pending, (state) => {
        state.error = null;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(refreshUser.rejected, (state) => {
        state.status = "idle";
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.data = null;
        state.status = "idle";
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
