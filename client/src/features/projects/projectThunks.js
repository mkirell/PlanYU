import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  isOffline,
  isNetworkError,
} from "../../shared/network/offlineNetworkUtils";
import {
  listFromCache,
  getFromCache,
  createOfflineProject,
  updateOfflineEntity,
  deleteOfflineEntity,
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

const STORE = "projects";
const ID_FIELD = "project_id";

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    if (isOffline()) {
      return listFromCache(STORE);
    }
    try {
      const data = await listOnline("/api/projects");
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
        err.response?.data?.error?.message || "Failed to fetch projects",
      );
    }
  },
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (id, { rejectWithValue }) => {
    if (isOffline()) {
      const cached = await getFromCache(STORE, id);
      if (cached) return cached;
      return rejectWithValue("Offline and project not cached");
    }
    try {
      const data = await getOnline(`/api/projects/${id}`);
      return cacheOnlineItem({ store: STORE, id: data[ID_FIELD], item: data });
    } catch (err) {
      if (isNetworkError(err)) {
        const cached = await getFromCache(STORE, id);
        if (cached) return cached;
        return rejectWithValue("Offline and project not cached");
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch project",
      );
    }
  },
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (project, { rejectWithValue }) => {
    const { ownerUserId, ...payload } = project || {};
    if (isOffline()) {
      return createOfflineProject({
        project: payload,
        ownerUserId,
      });
    }
    try {
      const data = await createOnline("/api/projects", payload);
      return cacheOnlineItem({ store: STORE, id: data[ID_FIELD], item: data });
    } catch (err) {
      if (isNetworkError(err)) {
        return createOfflineProject({
          project: payload,
          ownerUserId,
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to create project",
      );
    }
  },
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, data }, { rejectWithValue }) => {
    if (isOffline()) {
      return updateOfflineEntity({
        store: STORE,
        idField: ID_FIELD,
        id,
        patch: data,
        url: `/api/projects/${id}`,
      });
    }
    try {
      const result = await updateOnline(`/api/projects/${id}`, data);
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
          url: `/api/projects/${id}`,
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to update project",
      );
    }
  },
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id, { rejectWithValue }) => {
    if (isOffline()) {
      return deleteOfflineEntity({
        store: STORE,
        id,
        idField: ID_FIELD,
        url: `/api/projects/${id}`,
      });
    }
    try {
      await deleteOnline(`/api/projects/${id}`);
      return deleteCachedItem({ store: STORE, id });
    } catch (err) {
      if (isNetworkError(err)) {
        return deleteOfflineEntity({
          store: STORE,
          id,
          idField: ID_FIELD,
          url: `/api/projects/${id}`,
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to delete project",
      );
    }
  },
);
