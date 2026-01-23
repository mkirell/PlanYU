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

const STORE = "users";
const ID_FIELD = "user_id";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    if (isOffline()) {
      return listFromCache(STORE);
    }
    try {
      const data = await listOnline("/api/users");
      return cacheOnlineList({
        store: STORE,
        items: data,
        getKey: (item) => item[ID_FIELD] ?? item.id,
      });
    } catch (err) {
      if (isNetworkError(err)) {
        return listFromCache(STORE);
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch users",
      );
    }
  },
);

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id, { rejectWithValue }) => {
    if (isOffline()) {
      const cached = await getFromCache(STORE, id);
      if (cached) return cached;
      return rejectWithValue("Offline and user not cached");
    }
    try {
      const data = await getOnline(`/api/users/${id}`);
      const key = data[ID_FIELD] ?? data.id;
      return cacheOnlineItem({ store: STORE, id: key, item: data });
    } catch (err) {
      if (isNetworkError(err)) {
        const cached = await getFromCache(STORE, id);
        if (cached) return cached;
        return rejectWithValue("Offline and user not cached");
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch user",
      );
    }
  },
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (user, { rejectWithValue }) => {
    if (isOffline()) {
      return createOfflineEntity({
        store: STORE,
        idField: ID_FIELD,
        body: user,
        url: "/api/users",
      });
    }
    try {
      const data = await createOnline("/api/users", user);
      const key = data[ID_FIELD] ?? data.id;
      return cacheOnlineItem({ store: STORE, id: key, item: data });
    } catch (err) {
      if (isNetworkError(err)) {
        return createOfflineEntity({
          store: STORE,
          idField: ID_FIELD,
          body: user,
          url: "/api/users",
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to create user",
      );
    }
  },
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, data }, { rejectWithValue }) => {
    if (isOffline()) {
      return updateOfflineEntity({
        store: STORE,
        idField: ID_FIELD,
        id,
        patch: data,
        url: `/api/users/${id}`,
      });
    }
    try {
      const result = await updateOnline(`/api/users/${id}`, data);
      const key = result[ID_FIELD] ?? result.id;
      return cacheOnlineItem({ store: STORE, id: key, item: result });
    } catch (err) {
      if (isNetworkError(err)) {
        return updateOfflineEntity({
          store: STORE,
          idField: ID_FIELD,
          id,
          patch: data,
          url: `/api/users/${id}`,
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to update user",
      );
    }
  },
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    if (isOffline()) {
      return deleteOfflineEntity({
        store: STORE,
        id,
        idField: ID_FIELD,
        url: `/api/users/${id}`,
      });
    }
    try {
      await deleteOnline(`/api/users/${id}`);
      return deleteCachedItem({ store: STORE, id });
    } catch (err) {
      if (isNetworkError(err)) {
        return deleteOfflineEntity({
          store: STORE,
          id,
          idField: ID_FIELD,
          url: `/api/users/${id}`,
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to delete user",
      );
    }
  },
);
