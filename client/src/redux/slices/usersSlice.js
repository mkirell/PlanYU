import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (user) => {
    const res = await axios.post("/api/users/register", user);
    return res.data.data;
  }
);

export const loginUser = createAsyncThunk("users/loginUser", async (user) => {
  const res = await axios.post("/api/users/login", user);
  return res.data.data;
});

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const res = await axios.get("/api/users");
  return res.data.data;
});

const usersSlice = createSlice({
  name: "users",
  initialState: { data: null, list: [], status: "idle", error: null },
  reducers: {
    logoutUser(state) {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
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
        state.error = action.error.message;
      });
  },
});

export const { logoutUser } = usersSlice.actions;
export default usersSlice.reducer;
