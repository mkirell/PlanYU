import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const res = await axios.get("/api/tasks");
  return res.data.data;
});

export const fetchTaskById = createAsyncThunk(
  "tasks/fetchTaskById",
  async (id) => {
    const res = await axios.get(`/api/tasks/${id}`);
    return res.data.data;
  }
);

export const createTask = createAsyncThunk("tasks/createTask", async (task) => {
  const res = await axios.post("/api/tasks", task);
  return res.data.data;
});

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, data }) => {
    const res = await axios.patch(`/api/tasks/${id}`, data);
    return res.data.data;
  }
);

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id) => {
  await axios.delete(`/api/tasks/${id}`);
  return id;
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (t) => t.task_id === action.payload.task_id
        );
        if (index === -1) state.list.push(action.payload);
        else state.list[index] = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (t) => t.task_id === action.payload.task_id
        );
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t.task_id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
