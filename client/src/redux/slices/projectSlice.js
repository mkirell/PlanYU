import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    const res = await axios.get("/api/projects");
    return res.data.data;
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (id) => {
    const res = await axios.get(`/api/projects/${id}`);
    return res.data.data;
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (project) => {
    const res = await axios.post("/api/projects", project);
    return res.data.data;
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, data }) => {
    const res = await axios.patch(`/api/projects/${id}`, data);
    return res.data.data;
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id) => {
    await axios.delete(`/api/projects/${id}`);
    return id;
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (p) => p.project_id === action.payload.project_id
        );
        if (index === -1) state.list.push(action.payload);
        else state.list[index] = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (p) => p.project_id === action.payload.project_id
        );
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.project_id !== action.payload);
      });
  },
});

export default projectsSlice.reducer;
