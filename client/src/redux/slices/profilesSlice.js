import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProfiles = createAsyncThunk(
  "profiles/fetchProfiles",
  async () => {
    const res = await axios.get("/api/profiles");
    return res.data.data;
  }
);

export const fetchProfileById = createAsyncThunk(
  "profiles/fetchProfileById",
  async (id) => {
    const res = await axios.get(`/api/profiles/${id}`);
    return res.data.data;
  }
);

export const createProfile = createAsyncThunk(
  "profiles/createProfile",
  async (profile) => {
    const res = await axios.post("/api/profiles", profile);
    return res.data.data;
  }
);

export const updateProfile = createAsyncThunk(
  "profiles/updateProfile",
  async ({ id, data }) => {
    const res = await axios.patch(`/api/profiles/${id}`, data);
    return res.data.data;
  }
);

export const deleteProfile = createAsyncThunk(
  "profiles/deleteProfile",
  async (id) => {
    await axios.delete(`/api/profiles/${id}`);
    return id;
  }
);

const profilesSlice = createSlice({
  name: "profiles",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchProfileById.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (p) => p.profile_id === action.payload.profile_id
        );
        if (index === -1) state.list.push(action.payload);
        else state.list[index] = action.payload;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (p) => p.profile_id === action.payload.profile_id
        );
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.profile_id !== action.payload);
      });
  },
});

export default profilesSlice.reducer;
