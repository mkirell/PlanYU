import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  isOffline,
  isNetworkError,
} from "../../shared/network/connectivity";
import {
  registerOnline,
  loginOnline,
  refreshOnline,
  logoutOnline,
} from "../../shared/network/onlineApi";
import {
  setAuthHeader,
  saveAuthCache,
  clearAuthCache,
  loadAuthCache,
} from "../../shared/cache/offlineApi";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (user, { rejectWithValue }) => {
    try {
      return await registerOnline(user);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Registration failed",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (user, { rejectWithValue }) => {
    try {
      const data = await loginOnline(user);
      if (data?.accessToken) setAuthHeader(data.accessToken);
      await saveAuthCache(data);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Login failed",
      );
    }
  },
);

export const refreshUser = createAsyncThunk(
  "auth/refreshUser",
  async (_, { rejectWithValue }) => {
    if (isOffline()) {
      const offline = await loadAuthCache();
      if (offline) return offline;
      return rejectWithValue("Offline and no cached session");
    }

    try {
      const data = await refreshOnline();
      if (data?.accessToken) setAuthHeader(data.accessToken);
      await saveAuthCache(data);
      return data;
    } catch (err) {
      if (isNetworkError(err)) {
        const offline = await loadAuthCache();
        if (offline) return offline;
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Refresh failed",
      );
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    await logoutOnline();
  } catch {
    // Ignore network errors so offline logout still clears local state.
  }
  setAuthHeader(null);
  await clearAuthCache();
  return true;
});
