import { createAsyncThunk } from "@reduxjs/toolkit";
import { isOffline, isNetworkError } from "../../shared/network/connectivity";
import { makeCompositeKey } from "../../shared/cache/offlineStore";
import {
  listFromCache,
  getFromCache,
  createOfflineRelation,
  updateOfflineRelation,
  deleteOfflineRelation,
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

const STORE = "userProjects";

export const fetchUserProjects = createAsyncThunk(
  "userProjects/fetchUserProjects",
  async (_, { rejectWithValue }) => {
    if (isOffline()) {
      return listFromCache(STORE);
    }
    try {
      const data = await listOnline("/api/user-projects");
      return cacheOnlineList({
        store: STORE,
        items: data,
        getKey: (item) => makeCompositeKey([item.user_id, item.project_id]),
      });
    } catch (err) {
      if (isNetworkError(err)) {
        return listFromCache(STORE);
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch user projects",
      );
    }
  },
);

export const fetchUserProject = createAsyncThunk(
  "userProjects/fetchUserProject",
  async ({ user_id, project_id }, { rejectWithValue }) => {
    if (isOffline()) {
      const key = makeCompositeKey([user_id, project_id]);
      const cached = await getFromCache(STORE, key);
      if (cached) return cached;
      return rejectWithValue("Offline and user project not cached");
    }
    try {
      const data = await getOnline(
        `/api/user-projects/${user_id}/${project_id}`,
      );
      const key = makeCompositeKey([data.user_id, data.project_id]);
      return cacheOnlineItem({ store: STORE, id: key, item: data });
    } catch (err) {
      if (isNetworkError(err)) {
        const key = makeCompositeKey([user_id, project_id]);
        const cached = await getFromCache(STORE, key);
        if (cached) return cached;
        return rejectWithValue("Offline and user project not cached");
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch user project",
      );
    }
  },
);

export const createUserProject = createAsyncThunk(
  "userProjects/createUserProject",
  async (data, { rejectWithValue }) => {
    if (isOffline()) {
      const key = makeCompositeKey([data.user_id, data.project_id]);
      return createOfflineRelation({
        store: STORE,
        key,
        body: data,
        url: "/api/user-projects",
        ids: { user_id: data.user_id, project_id: data.project_id },
      });
    }
    try {
      const result = await createOnline("/api/user-projects", data);
      const key = makeCompositeKey([result.user_id, result.project_id]);
      return cacheOnlineItem({ store: STORE, id: key, item: result });
    } catch (err) {
      if (isNetworkError(err)) {
        const key = makeCompositeKey([data.user_id, data.project_id]);
        return createOfflineRelation({
          store: STORE,
          key,
          body: data,
          url: "/api/user-projects",
          ids: { user_id: data.user_id, project_id: data.project_id },
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to create user project",
      );
    }
  },
);

export const updateUserProject = createAsyncThunk(
  "userProjects/updateUserProject",
  async ({ user_id, project_id, data }, { rejectWithValue }) => {
    if (isOffline()) {
      const key = makeCompositeKey([user_id, project_id]);
      return updateOfflineRelation({
        store: STORE,
        key,
        body: { ...data, user_id, project_id },
        url: `/api/user-projects/${user_id}/${project_id}`,
        ids: { user_id, project_id },
      });
    }
    try {
      const result = await updateOnline(
        `/api/user-projects/${user_id}/${project_id}`,
        data,
      );
      const key = makeCompositeKey([result.user_id, result.project_id]);
      return cacheOnlineItem({ store: STORE, id: key, item: result });
    } catch (err) {
      if (isNetworkError(err)) {
        const key = makeCompositeKey([user_id, project_id]);
        return updateOfflineRelation({
          store: STORE,
          key,
          body: { ...data, user_id, project_id },
          url: `/api/user-projects/${user_id}/${project_id}`,
          ids: { user_id, project_id },
        });
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to update user project",
      );
    }
  },
);

export const deleteUserProject = createAsyncThunk(
  "userProjects/deleteUserProject",
  async ({ user_id, project_id }, { rejectWithValue, getState }) => {
    const state = getState();
    const tasks = state?.tasks?.list || [];
    const userTasks = state?.usertasks?.list || [];
    const projectTaskIds = tasks
      .filter((t) => Number(t.project_id) === Number(project_id))
      .map((t) => t.task_id);
    const toRemove = userTasks.filter(
      (ut) =>
        Number(ut.user_id) === Number(user_id) &&
        projectTaskIds.includes(ut.task_id),
    );

    if (isOffline()) {
      const key = makeCompositeKey([user_id, project_id]);
      await Promise.all(
        toRemove.map((ut) =>
          deleteCachedItem({
            store: "userTasks",
            id: makeCompositeKey([ut.user_id, ut.task_id]),
          }),
        ),
      );
      await deleteOfflineRelation({
        store: STORE,
        key,
        url: `/api/user-projects/${user_id}/${project_id}`,
        ids: { user_id, project_id },
      });
      return { user_id, project_id, removedTaskIds: projectTaskIds };
    }
    try {
      await deleteOnline(`/api/user-projects/${user_id}/${project_id}`);
      const key = makeCompositeKey([user_id, project_id]);
      await deleteCachedItem({ store: STORE, id: key });
      await Promise.all(
        toRemove.map((ut) =>
          deleteCachedItem({
            store: "userTasks",
            id: makeCompositeKey([ut.user_id, ut.task_id]),
          }),
        ),
      );
      return { user_id, project_id, removedTaskIds: projectTaskIds };
    } catch (err) {
      if (isNetworkError(err)) {
        const key = makeCompositeKey([user_id, project_id]);
        await Promise.all(
          toRemove.map((ut) =>
            deleteCachedItem({
              store: "userTasks",
              id: makeCompositeKey([ut.user_id, ut.task_id]),
            }),
          ),
        );
        await deleteOfflineRelation({
          store: STORE,
          key,
          url: `/api/user-projects/${user_id}/${project_id}`,
          ids: { user_id, project_id },
        });
        return { user_id, project_id, removedTaskIds: projectTaskIds };
      }
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to delete user project",
      );
    }
  },
);
