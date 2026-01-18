import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProfiles,
  fetchProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
} from "./profileThunks";

const profilesSlice = createSlice({
  name: "profiles",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchProfileById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfileById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.list.findIndex(
          (p) => p.profile_id === action.payload.profile_id
        );
        if (index === -1) state.list.push(action.payload);
        else state.list[index] = action.payload;
      })
      .addCase(fetchProfileById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.list.findIndex(
          (p) => p.profile_id === action.payload.profile_id
        );
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = state.list.filter((p) => p.profile_id !== action.payload);
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default profilesSlice.reducer;
