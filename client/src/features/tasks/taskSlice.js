import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTasks,
  fetchTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "./taskThunks";

const tasksSlice = createSlice({
  name: "tasks",
  initialState: { list: [], status: "idle", error: null, message: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchTaskById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.list.findIndex(
          (t) => t.task_id === action.payload.task_id
        );
        if (index === -1) state.list.push(action.payload);
        else state.list[index] = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
        state.message = action.payload?.message || "Task created";
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.message = action.payload || "Failed to create task";
      })
      .addCase(updateTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.list.findIndex(
          (t) => t.task_id === action.payload.task_id
        );
        if (index !== -1) state.list[index] = action.payload;
        state.message = action.payload?.message || "Task updated";
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.message = action.payload || "Failed to update task";
      })
      .addCase(deleteTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = state.list.filter((t) => t.task_id !== action.payload);
        state.message = "Task deleted";
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.message = action.payload || "Failed to delete task";
      });
  },
});

export default tasksSlice.reducer;
