import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserProjects,
  fetchUserProject,
  createUserProject,
  updateUserProject,
  deleteUserProject,
} from "./userProjectThunks";

const userProjectsSlice = createSlice({
  name: "userProjects",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProjects.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchUserProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchUserProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        const exists = state.list.find(
          (up) =>
            up.user_id === action.payload.user_id &&
            up.project_id === action.payload.project_id
        );
        if (!exists) state.list.push(action.payload);
      })
      .addCase(fetchUserProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createUserProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createUserProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(createUserProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUserProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.list.findIndex(
          (up) =>
            up.user_id === action.payload.user_id &&
            up.project_id === action.payload.project_id
        );
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateUserProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteUserProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteUserProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = state.list.filter(
          (up) =>
            !(
              up.user_id === action.payload.user_id &&
              up.project_id === action.payload.project_id
            )
        );
      })
      .addCase(deleteUserProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default userProjectsSlice.reducer;
