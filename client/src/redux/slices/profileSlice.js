import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProfiles = createAsyncThunk(
  "profiles/fetchProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/profiles");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch profiles"
      );
    }
  }
);

export const fetchProfileById = createAsyncThunk(
  "profiles/fetchProfileById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/profiles/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch profile"
      );
    }
  }
);

export const createProfile = createAsyncThunk(
  "profiles/createProfile",
  async (profile, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/profiles", profile);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to create profile"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profiles/updateProfile",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/api/profiles/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to update profile"
      );
    }
  }
);

export const deleteProfile = createAsyncThunk(
  "profiles/deleteProfile",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/profiles/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to delete profile"
      );
    }
  }
);

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
