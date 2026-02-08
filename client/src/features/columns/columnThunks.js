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

const STORE = "columns";
const ID_FIELD = "status_id";

export const fetchColumns = createAsyncThunk(
  "columns/fetchColumns",
  async ({ project_id } = {}, { rejectWithValue }) => {
    if (project_id === undefined || project_id === null) {
      return listFromCache(STORE);
    }
    const query = new URLSearchParams();
    if (project_id !== undefined && project_id !== null)
      query.set("project_id", String(project_id));
    const path = query.toString() ? `/api/statuses?${query}` : "/api/statuses";

    if (isOffline()) {
      return listFromCache(STORE);
    }
    try {
      const data = await listOnline(path);
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
        err.response?.data?.error?.message || "Failed to fetch columns",
      );
    }
  },
);

export const fetchColumnById = createAsyncThunk(
  "columns/fetchColumnById",
  async (id, { rejectWithValue }) => {
    if (isOffline()) {
      const cached = await getFromCache(STORE, id);
      if (cached) return cached;
      return rejectWithValue("Offline and column not cached");
    }
    try {
      const data = await getOnline(`/api/statuses/${id}`);
      return cacheOnlineItem({ store: STORE, id: data[ID_FIELD], item: data });
    } catch (err) {
      if (isNetworkError(err)) {
        const cached = await getFromCache(STORE, id);
        if (cached) return cached;
        return rejectWithValue("Offline and column not cached");
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch column",
      );
    }
  },
);

export const createColumn = createAsyncThunk(
  "columns/createColumn",
  async (column, { rejectWithValue }) => {
    if (isOffline()) {
      return createOfflineEntity({
        store: STORE,
        idField: ID_FIELD,
        body: column,
        url: "/api/statuses",
      });
    }
    try {
      const data = await createOnline("/api/statuses", column);
      return cacheOnlineItem({ store: STORE, id: data[ID_FIELD], item: data });
    } catch (err) {
      if (isNetworkError(err)) {
        return createOfflineEntity({
          store: STORE,
          idField: ID_FIELD,
          body: column,
          url: "/api/statuses",
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to create column",
      );
    }
  },
);

export const updateColumn = createAsyncThunk(
  "columns/updateColumn",
  async ({ id, data }, { rejectWithValue }) => {
    if (isOffline()) {
      return updateOfflineEntity({
        store: STORE,
        idField: ID_FIELD,
        id,
        patch: data,
        url: `/api/statuses/${id}`,
      });
    }
    try {
      const result = await updateOnline(`/api/statuses/${id}`, data);
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
          url: `/api/statuses/${id}`,
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to update column",
      );
    }
  },
);

export const deleteColumn = createAsyncThunk(
  "columns/deleteColumn",
  async (id, { rejectWithValue }) => {
    if (isOffline()) {
      return deleteOfflineEntity({
        store: STORE,
        id,
        idField: ID_FIELD,
        url: `/api/statuses/${id}`,
      });
    }
    try {
      await deleteOnline(`/api/statuses/${id}`);
      await deleteCachedItem({ store: STORE, id });
      return id;
    } catch (err) {
      if (isNetworkError(err)) {
        return deleteOfflineEntity({
          store: STORE,
          id,
          idField: ID_FIELD,
          url: `/api/statuses/${id}`,
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to delete column",
      );
    }
  },
);
