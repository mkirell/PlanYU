import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserTasks,
  fetchUserTask,
  createUserTask,
  updateUserTask,
  deleteUserTask,
} from "./userTaskThunks";

const userTasksSlice = createSlice({
  name: "userTasks",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTasks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchUserTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchUserTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        const exists = state.list.find(
          (ut) =>
            ut.user_id === action.payload.user_id &&
            ut.task_id === action.payload.task_id
        );
        if (!exists) state.list.push(action.payload);
      })
      .addCase(fetchUserTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createUserTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createUserTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(createUserTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUserTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.list.findIndex(
          (ut) =>
            ut.user_id === action.payload.user_id &&
            ut.task_id === action.payload.task_id
        );
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateUserTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteUserTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteUserTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = state.list.filter(
          (ut) =>
            !(
              ut.user_id === action.payload.user_id &&
              ut.task_id === action.payload.task_id
            )
        );
      })
      .addCase(deleteUserTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default userTasksSlice.reducer;
