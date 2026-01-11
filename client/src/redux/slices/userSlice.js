import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/users");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || "Failed to fetch users");
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/users/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || "Failed to fetch user");
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (user, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/users", user);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || "Failed to create user");
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/api/users/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || "Failed to update user");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/users/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || "Failed to delete user");
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.list.findIndex(
          (u) => u.user_id === action.payload.user_id
        );
        if (index === -1) state.list.push(action.payload);
        else state.list[index] = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        const idx = state.list.findIndex(
          (u) => u.user_id === action.payload.user_id
        );
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = state.list.filter((u) => u.user_id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
