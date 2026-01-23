import { createAsyncThunk } from "@reduxjs/toolkit";
import { isOffline, isNetworkError } from "../../shared/network/connectivity";
import {
  listFromCache,
  getFromCache,
  createOfflineEntity,
  updateOfflineEntity,
  deleteOfflineEntity,
  cacheOnlineList,
  cacheOnlineItem,
  deleteCachedItem,
} from "../../shared/cache/offlineApi";
import {
  listOnline,
  getOnline,
  createOnline,
  updateOnline,
  deleteOnline,
} from "../../shared/network/onlineApi";

const STORE = "profiles";
const ID_FIELD = "profile_id";

export const fetchProfiles = createAsyncThunk(
  "profiles/fetchProfiles",
  async (_, { rejectWithValue }) => {
    if (isOffline()) {
      return listFromCache(STORE);
    }
    try {
      const data = await listOnline("/api/profiles");
      return cacheOnlineList({
        store: STORE,
        items: data,
        getKey: (item) => item[ID_FIELD],
      });
    } catch (err) {
      if (isNetworkError(err)) {
        return listFromCache(STORE);
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch profiles",
      );
    }
  },
);

export const fetchProfileById = createAsyncThunk(
  "profiles/fetchProfileById",
  async (id, { rejectWithValue }) => {
    if (isOffline()) {
      const cached = await getFromCache(STORE, id);
      if (cached) return cached;
      return rejectWithValue("Offline and profile not cached");
    }
    try {
      const data = await getOnline(`/api/profiles/${id}`);
      return cacheOnlineItem({ store: STORE, id: data[ID_FIELD], item: data });
    } catch (err) {
      if (isNetworkError(err)) {
        const cached = await getFromCache(STORE, id);
        if (cached) return cached;
        return rejectWithValue("Offline and profile not cached");
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch profile",
      );
    }
  },
);

export const createProfile = createAsyncThunk(
  "profiles/createProfile",
  async (profile, { rejectWithValue }) => {
    if (isOffline()) {
      return createOfflineEntity({
        store: STORE,
        idField: ID_FIELD,
        body: profile,
        url: "/api/profiles",
      });
    }
    try {
      const data = await createOnline("/api/profiles", profile);
      return cacheOnlineItem({ store: STORE, id: data[ID_FIELD], item: data });
    } catch (err) {
      if (isNetworkError(err)) {
        return createOfflineEntity({
          store: STORE,
          idField: ID_FIELD,
          body: profile,
          url: "/api/profiles",
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to create profile",
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  "profiles/updateProfile",
  async ({ id, data }, { rejectWithValue }) => {
    if (isOffline()) {
      return updateOfflineEntity({
        store: STORE,
        idField: ID_FIELD,
        id,
        patch: data,
        url: `/api/profiles/${id}`,
      });
    }
    try {
      const result = await updateOnline(`/api/profiles/${id}`, data);
      return cacheOnlineItem({
        store: STORE,
        id: result[ID_FIELD],
        item: result,
      });
    } catch (err) {
      if (isNetworkError(err)) {
        return updateOfflineEntity({
          store: STORE,
          idField: ID_FIELD,
          id,
          patch: data,
          url: `/api/profiles/${id}`,
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to update profile",
      );
    }
  },
);

export const deleteProfile = createAsyncThunk(
  "profiles/deleteProfile",
  async (id, { rejectWithValue }) => {
    if (isOffline()) {
      return deleteOfflineEntity({
        store: STORE,
        id,
        idField: ID_FIELD,
        url: `/api/profiles/${id}`,
      });
    }
    try {
      await deleteOnline(`/api/profiles/${id}`);
      return deleteCachedItem({ store: STORE, id });
    } catch (err) {
      if (isNetworkError(err)) {
        return deleteOfflineEntity({
          store: STORE,
          id,
          idField: ID_FIELD,
          url: `/api/profiles/${id}`,
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to delete profile",
      );
    }
  },
);
