import { createAsyncThunk } from "@reduxjs/toolkit";
import { isOffline, isNetworkError } from "../../shared/network/connectivity";
import { makeCompositeKey } from "../../shared/cache/offlineStore";
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

const STORE = "tasks";
const ID_FIELD = "task_id";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    if (isOffline()) {
      return listFromCache(STORE);
    }
    try {
      const data = await listOnline("/api/tasks");
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
        err.response?.data?.error?.message || "Failed to fetch tasks",
      );
    }
  },
);

export const fetchTaskById = createAsyncThunk(
  "tasks/fetchTaskById",
  async (id, { rejectWithValue }) => {
    if (isOffline()) {
      const cached = await getFromCache(STORE, id);
      if (cached) return cached;
      return rejectWithValue("Offline and task not cached");
    }
    try {
      const data = await getOnline(`/api/tasks/${id}`);
      return cacheOnlineItem({ store: STORE, id: data[ID_FIELD], item: data });
    } catch (err) {
      if (isNetworkError(err)) {
        const cached = await getFromCache(STORE, id);
        if (cached) return cached;
        return rejectWithValue("Offline and task not cached");
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch task",
      );
    }
  },
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (task, { rejectWithValue }) => {
    if (isOffline()) {
      return createOfflineEntity({
        store: STORE,
        idField: ID_FIELD,
        body: task,
        url: "/api/tasks",
      });
    }
    try {
      const data = await createOnline("/api/tasks", task);
      return cacheOnlineItem({ store: STORE, id: data[ID_FIELD], item: data });
    } catch (err) {
      if (isNetworkError(err)) {
        return createOfflineEntity({
          store: STORE,
          idField: ID_FIELD,
          body: task,
          url: "/api/tasks",
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to create task",
      );
    }
  },
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, data }, { rejectWithValue }) => {
    if (isOffline()) {
      return updateOfflineEntity({
        store: STORE,
        idField: ID_FIELD,
        id,
        patch: data,
        url: `/api/tasks/${id}`,
      });
    }
    try {
      const result = await updateOnline(`/api/tasks/${id}`, data);
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
          url: `/api/tasks/${id}`,
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to update task",
      );
    }
  },
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, { rejectWithValue, getState }) => {
    const state = getState();
    const userTasks = state?.userTasks?.list || [];
    const toRemove = userTasks.filter((ut) => ut.task_id === id);

    if (isOffline()) {
      await Promise.all(
        toRemove.map((ut) =>
          deleteCachedItem({
            store: "userTasks",
            id: makeCompositeKey([ut.user_id, ut.task_id]),
          }),
        ),
      );
      return deleteOfflineEntity({
        store: STORE,
        id,
        idField: ID_FIELD,
        url: `/api/tasks/${id}`,
      });
    }
    try {
      await deleteOnline(`/api/tasks/${id}`);
      await deleteCachedItem({ store: STORE, id });
      await Promise.all(
        toRemove.map((ut) =>
          deleteCachedItem({
            store: "userTasks",
            id: makeCompositeKey([ut.user_id, ut.task_id]),
          }),
        ),
      );
      return id;
    } catch (err) {
      if (isNetworkError(err)) {
        await Promise.all(
          toRemove.map((ut) =>
            deleteCachedItem({
              store: "userTasks",
              id: makeCompositeKey([ut.user_id, ut.task_id]),
            }),
          ),
        );
        return deleteOfflineEntity({
          store: STORE,
          id,
          idField: ID_FIELD,
          url: `/api/tasks/${id}`,
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to delete task",
      );
    }
  },
);
