import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserProjects = createAsyncThunk(
  "userProjects/fetchUserProjects",
  async () => {
    const res = await axios.get("/api/user-projects");
    return res.data.data;
  }
);

export const fetchUserProject = createAsyncThunk(
  "userProjects/fetchUserProject",
  async ({ user_id, project_id }) => {
    const res = await axios.get(`/api/user-projects/${user_id}/${project_id}`);
    return res.data.data;
  }
);

export const createUserProject = createAsyncThunk(
  "userProjects/createUserProject",
  async (data) => {
    const res = await axios.post("/api/user-projects", data);
    return res.data.data;
  }
);

export const updateUserProject = createAsyncThunk(
  "userProjects/updateUserProject",
  async ({ user_id, project_id, data }) => {
    const res = await axios.patch(
      `/api/user-projects/${user_id}/${project_id}`,
      data
    );
    return res.data.data;
  }
);

export const deleteUserProject = createAsyncThunk(
  "userProjects/deleteUserProject",
  async ({ user_id, project_id }) => {
    await axios.delete(`/api/user-projects/${user_id}/${project_id}`);
    return { user_id, project_id };
  }
);

const userProjectsSlice = createSlice({
  name: "userProjects",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchUserProject.fulfilled, (state, action) => {
        const exists = state.list.find(
          (up) =>
            up.user_id === action.payload.user_id &&
            up.project_id === action.payload.project_id
        );
        if (!exists) state.list.push(action.payload);
      })
      .addCase(createUserProject.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateUserProject.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (up) =>
            up.user_id === action.payload.user_id &&
            up.project_id === action.payload.project_id
        );
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteUserProject.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (up) =>
            !(
              up.user_id === action.payload.user_id &&
              up.project_id === action.payload.project_id
            )
        );
      });
  },
});

export default userProjectsSlice.reducer;
