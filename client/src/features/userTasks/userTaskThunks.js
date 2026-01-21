import { createAsyncThunk } from "@reduxjs/toolkit";
import { isOffline, isNetworkError } from "../../shared/network/offlineNetworkUtils";
import { makeCompositeKey } from "../../shared/offline/offlineStoreHelpers";
import {
  listFromCache,
  getFromCache,
  createOfflineRelation,
  updateOfflineRelation,
  deleteOfflineRelation,
  cacheOnlineList,
  cacheOnlineItem,
  deleteCachedItem,
} from "../../shared/offline/apiOfflineHelpers";
import {
  listOnline,
  getOnline,
  createOnline,
  updateOnline,
  deleteOnline,
} from "../../shared/network/apiOnlineHelpers";

const STORE = "userTasks";

export const fetchUserTasks = createAsyncThunk(
  "userTasks/fetchUserTasks",
  async (_, { rejectWithValue }) => {
    if (isOffline()) {
      return listFromCache(STORE);
    }
    try {
      const data = await listOnline("/api/user-tasks");
      return cacheOnlineList({
        store: STORE,
        items: data,
        getKey: (item) => makeCompositeKey([item.user_id, item.task_id]),
      });
    } catch (err) {
      if (isNetworkError(err)) {
        return listFromCache(STORE);
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch user tasks",
      );
    }
  },
);

export const fetchUserTask = createAsyncThunk(
  "userTasks/fetchUserTask",
  async ({ user_id, task_id }, { rejectWithValue }) => {
    if (isOffline()) {
      const key = makeCompositeKey([user_id, task_id]);
      const cached = await getFromCache(STORE, key);
      if (cached) return cached;
      return rejectWithValue("Offline and user task not cached");
    }
    try {
      const data = await getOnline(`/api/user-tasks/${user_id}/${task_id}`);
      const key = makeCompositeKey([data.user_id, data.task_id]);
      return cacheOnlineItem({ store: STORE, id: key, item: data });
    } catch (err) {
      if (isNetworkError(err)) {
        const key = makeCompositeKey([user_id, task_id]);
        const cached = await getFromCache(STORE, key);
        if (cached) return cached;
        return rejectWithValue("Offline and user task not cached");
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch user task",
      );
    }
  },
);

export const createUserTask = createAsyncThunk(
  "userTasks/createUserTask",
  async (data, { rejectWithValue }) => {
    if (isOffline()) {
      const key = makeCompositeKey([data.user_id, data.task_id]);
      return createOfflineRelation({
        store: STORE,
        key,
        body: data,
        url: "/api/user-tasks",
        ids: { user_id: data.user_id, task_id: data.task_id },
      });
    }
    try {
      const result = await createOnline("/api/user-tasks", data);
      const key = makeCompositeKey([result.user_id, result.task_id]);
      return cacheOnlineItem({ store: STORE, id: key, item: result });
    } catch (err) {
      if (isNetworkError(err)) {
        const key = makeCompositeKey([data.user_id, data.task_id]);
        return createOfflineRelation({
          store: STORE,
          key,
          body: data,
          url: "/api/user-tasks",
          ids: { user_id: data.user_id, task_id: data.task_id },
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to create user task",
      );
    }
  },
);

export const updateUserTask = createAsyncThunk(
  "userTasks/updateUserTask",
  async ({ user_id, task_id, data }, { rejectWithValue }) => {
    if (isOffline()) {
      const key = makeCompositeKey([user_id, task_id]);
      return updateOfflineRelation({
        store: STORE,
        key,
        body: { ...data, user_id, task_id },
        url: `/api/user-tasks/${user_id}/${task_id}`,
        ids: { user_id, task_id },
      });
    }
    try {
      const result = await updateOnline(
        `/api/user-tasks/${user_id}/${task_id}`,
        data,
      );
      const key = makeCompositeKey([result.user_id, result.task_id]);
      return cacheOnlineItem({ store: STORE, id: key, item: result });
    } catch (err) {
      if (isNetworkError(err)) {
        const key = makeCompositeKey([user_id, task_id]);
        return updateOfflineRelation({
          store: STORE,
          key,
          body: { ...data, user_id, task_id },
          url: `/api/user-tasks/${user_id}/${task_id}`,
          ids: { user_id, task_id },
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to update user task",
      );
    }
  },
);

export const deleteUserTask = createAsyncThunk(
  "userTasks/deleteUserTask",
  async ({ user_id, task_id }, { rejectWithValue }) => {
    if (isOffline()) {
      const key = makeCompositeKey([user_id, task_id]);
      await deleteOfflineRelation({
        store: STORE,
        key,
        url: `/api/user-tasks/${user_id}/${task_id}`,
        ids: { user_id, task_id },
      });
      return { user_id, task_id };
    }
    try {
      await deleteOnline(`/api/user-tasks/${user_id}/${task_id}`);
      const key = makeCompositeKey([user_id, task_id]);
      await deleteCachedItem({ store: STORE, id: key });
      return { user_id, task_id };
    } catch (err) {
      if (isNetworkError(err)) {
        const key = makeCompositeKey([user_id, task_id]);
        await deleteOfflineRelation({
          store: STORE,
          key,
          url: `/api/user-tasks/${user_id}/${task_id}`,
          ids: { user_id, task_id },
        });
        return { user_id, task_id };
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to delete user task",
      );
    }
  },
);
