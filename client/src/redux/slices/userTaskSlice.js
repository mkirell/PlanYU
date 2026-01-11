import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserTasks = createAsyncThunk(
  "userTasks/fetchUserTasks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/user-tasks");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.warning || "Failed to fetch user tasks."
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
        err.response?.data?.warning || "Failed to fetch user task."
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
        err.response?.data?.warning || "Failed to create user task."
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
        err.response?.data?.warning || "Failed to update user task."
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
        err.response?.data?.warning || "Failed to delete user task."
      );
    }
  }
);

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
