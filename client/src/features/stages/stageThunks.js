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

const STORE = "stages";
const ID_FIELD = "stage_id";

export const fetchStages = createAsyncThunk(
  "stages/fetchStages",
  async ({ project_id } = {}, { rejectWithValue }) => {
    if (project_id === undefined || project_id === null) {
      return listFromCache(STORE);
    }
    const query = new URLSearchParams();
    if (project_id !== undefined && project_id !== null)
      query.set("project_id", String(project_id));
    const path = query.toString() ? `/api/stages?${query}` : "/api/stages";

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
        err.response?.data?.error?.message || "Failed to fetch stages",
      );
    }
  },
);

export const fetchStageById = createAsyncThunk(
  "stages/fetchStageById",
  async (id, { rejectWithValue }) => {
    if (isOffline()) {
      const cached = await getFromCache(STORE, id);
      if (cached) return cached;
      return rejectWithValue("Offline and stage not cached");
    }
    try {
      const data = await getOnline(`/api/stages/${id}`);
      return cacheOnlineItem({ store: STORE, id: data[ID_FIELD], item: data });
    } catch (err) {
      if (isNetworkError(err)) {
        const cached = await getFromCache(STORE, id);
        if (cached) return cached;
        return rejectWithValue("Offline and stage not cached");
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch stage",
      );
    }
  },
);

export const createStage = createAsyncThunk(
  "stages/createStage",
  async (stage, { rejectWithValue }) => {
    if (isOffline()) {
      return createOfflineEntity({
        store: STORE,
        idField: ID_FIELD,
        body: stage,
        url: "/api/stages",
      });
    }
    try {
      const data = await createOnline("/api/stages", stage);
      return cacheOnlineItem({ store: STORE, id: data[ID_FIELD], item: data });
    } catch (err) {
      if (isNetworkError(err)) {
        return createOfflineEntity({
          store: STORE,
          idField: ID_FIELD,
          body: stage,
          url: "/api/stages",
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to create stage",
      );
    }
  },
);

export const updateStage = createAsyncThunk(
  "stages/updateStage",
  async ({ id, data }, { rejectWithValue }) => {
    if (isOffline()) {
      return updateOfflineEntity({
        store: STORE,
        idField: ID_FIELD,
        id,
        patch: data,
        url: `/api/stages/${id}`,
      });
    }
    try {
      const result = await updateOnline(`/api/stages/${id}`, data);
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
          url: `/api/stages/${id}`,
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to update stage",
      );
    }
  },
);

export const deleteStage = createAsyncThunk(
  "stages/deleteStage",
  async (id, { rejectWithValue }) => {
    if (isOffline()) {
      return deleteOfflineEntity({
        store: STORE,
        id,
        idField: ID_FIELD,
        url: `/api/stages/${id}`,
      });
    }
    try {
      await deleteOnline(`/api/stages/${id}`);
      await deleteCachedItem({ store: STORE, id });
      return id;
    } catch (err) {
      if (isNetworkError(err)) {
        return deleteOfflineEntity({
          store: STORE,
          id,
          idField: ID_FIELD,
          url: `/api/stages/${id}`,
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to delete stage",
      );
    }
  },
);
