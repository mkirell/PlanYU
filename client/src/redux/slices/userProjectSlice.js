import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserProjects = createAsyncThunk(
  "userProjects/fetchUserProjects",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/user-projects");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch user projects"
      );
    }
  }
);

export const fetchUserProject = createAsyncThunk(
  "userProjects/fetchUserProject",
  async ({ user_id, project_id }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `/api/user-projects/${user_id}/${project_id}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch user project"
      );
    }
  }
);

export const createUserProject = createAsyncThunk(
  "userProjects/createUserProject",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/user-projects", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to create user project"
      );
    }
  }
);

export const updateUserProject = createAsyncThunk(
  "userProjects/updateUserProject",
  async ({ user_id, project_id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `/api/user-projects/${user_id}/${project_id}`,
        data
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to update user project"
      );
    }
  }
);

export const deleteUserProject = createAsyncThunk(
  "userProjects/deleteUserProject",
  async ({ user_id, project_id }, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/user-projects/${user_id}/${project_id}`);
      return { user_id, project_id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to delete user project"
      );
    }
  }
);

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
