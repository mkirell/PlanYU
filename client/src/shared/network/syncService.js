import axios from "axios";
import {
  getOfflineQueue,
  deleteOfflineQueueItem,
  setIdMapping,
  getIdMapping,
  upsertEntity,
  deleteEntity,
} from "../cache/idbService";
import { LOCAL_ID_PREFIX } from "../cache/offlineStore";
import { fetchProjects } from "../../features/projects/projectThunks";
import { fetchColumns } from "../../features/columns/columnThunks";
import { fetchTasks } from "../../features/tasks/taskThunks";
import { fetchProfiles } from "../../features/profiles/profileThunks";
import { fetchUsers } from "../../features/users/userThunks";
import { fetchUserProjects } from "../../features/userProjects/userProjectThunks";
import { fetchUserTasks } from "../../features/userTasks/userTaskThunks";

const ID_ENTITY_MAP = {
  project_id: "projects",
  status_id: "columns",
  task_id: "tasks",
  profile_id: "profiles",
  user_id: "users",
};

const isLocalId = (id) =>
  typeof id === "string" && id.startsWith(LOCAL_ID_PREFIX);

const resolveId = async (entity, id) => {
  if (!isLocalId(id)) return id;
  const mapped = await getIdMapping(entity, id);
  return mapped || null;
};

const resolveIds = async (ids = {}) => {
  const resolved = {};
  for (const [field, value] of Object.entries(ids)) {
    const entity = ID_ENTITY_MAP[field];
    if (!entity) {
      resolved[field] = value;
      continue;
    }
    const actual = await resolveId(entity, value);
    if (actual === null) return { ok: false };
    resolved[field] = actual;
  }
  return { ok: true, ids: resolved };
};

const resolveBodyIds = async (body) => {
  if (!body) return { ok: true, body };
  const candidateFields = [
    "user_id",
    "project_id",
    "task_id",
    "status_id",
    "profile_id",
  ];
  const resolved = { ...body };
  for (const field of candidateFields) {
    if (!(field in resolved)) continue;
    const entity = ID_ENTITY_MAP[field];
    const actual = await resolveId(entity, resolved[field]);
    if (actual === null) return { ok: false };
    resolved[field] = actual;
  }
  return { ok: true, body: resolved };
};

const replaceUrlIds = (url, originalIds, resolvedIds) => {
  let next = url;
  Object.keys(originalIds || {}).forEach((field) => {
    const before = originalIds[field];
    const after = resolvedIds[field];
    if (before && after && before !== after) {
      next = next.replace(String(before), String(after));
    }
  });
  return next;
};

const getEntityKeyFromData = (entity, data) => {
  if (!data) return null;
  if (entity === "projects") return data.project_id;
  if (entity === "columns") return data.status_id;
  if (entity === "tasks") return data.task_id;
  if (entity === "profiles") return data.profile_id;
  if (entity === "users") return data.user_id ?? data.id;
  if (entity === "userProjects") return `${data.user_id}:${data.project_id}`;
  if (entity === "userTasks") return `${data.user_id}:${data.task_id}`;
  return null;
};

const getEntityKeyFromIds = (entity, ids) => {
  if (entity === "projects") return ids.project_id;
  if (entity === "columns") return ids.status_id;
  if (entity === "tasks") return ids.task_id;
  if (entity === "profiles") return ids.profile_id;
  if (entity === "users") return ids.user_id;
  if (entity === "userProjects") return `${ids.user_id}:${ids.project_id}`;
  if (entity === "userTasks") return `${ids.user_id}:${ids.task_id}`;
  return null;
};

const refreshAll = async (store) => {
  if (!store) return;
  await Promise.all([
    store.dispatch(fetchProjects()),
    store.dispatch(fetchColumns()),
    store.dispatch(fetchTasks()),
    store.dispatch(fetchProfiles()),
    store.dispatch(fetchUsers()),
    store.dispatch(fetchUserProjects()),
    store.dispatch(fetchUserTasks()),
  ]);
};

const isConflict = (err) => err?.response?.status === 409;
const isUnauthorized = (err) => err?.response?.status === 401;
const isForbidden = (err) => err?.response?.status === 403;

let syncInProgress = false;

const isAuthenticated = (store) => {
  if (!store?.getState) return false;
  const state = store.getState();
  return Boolean(state?.auth?.data?.user?.user_id);
};

export const syncOfflineQueue = async (store) => {
  if (typeof navigator !== "undefined" && !navigator.onLine) return;
  if (!isAuthenticated(store)) return;
  if (syncInProgress) return;

  syncInProgress = true;

  try {
    const queue = await getOfflineQueue();
    if (!queue || queue.length === 0) return;
    let pending = [...queue].sort((a, b) => a.id - b.id);
    let progressed = true;
    let didSync = false;

    while (pending.length > 0 && progressed) {
      progressed = false;
      const nextPending = [];

      for (const item of pending) {
        const idsResult = await resolveIds(item.ids || {});
        if (!idsResult.ok) {
          nextPending.push(item);
          continue;
        }

        const bodyResult = await resolveBodyIds(item.body);
        if (!bodyResult.ok) {
          nextPending.push(item);
          continue;
        }

        const resolvedIds = idsResult.ids || {};
        const resolvedUrl = replaceUrlIds(
          item.url,
          item.ids || {},
          resolvedIds,
        );

        try {
          const resp = await axios({
            method: item.method,
            url: resolvedUrl,
            data: bodyResult.body,
          });

          if (item.method === "POST") {
            const data = resp?.data;
            const realId = getEntityKeyFromData(item.entity, data);
            if (item.tempId && realId) {
              await setIdMapping(item.entity, item.tempId, realId);
              await deleteEntity(item.entity, item.tempId);
            }
            if (realId) {
              await upsertEntity(item.entity, realId, data);
            }
          }

          if (item.method === "PATCH") {
            const data = resp?.data;
            const realId = getEntityKeyFromData(item.entity, data);
            if (realId) {
              await upsertEntity(item.entity, realId, data);
              if (item.entityKey && item.entityKey !== realId) {
                await deleteEntity(item.entity, item.entityKey);
              }
            }
          }

          if (item.method === "DELETE") {
            const resolvedKey = getEntityKeyFromIds(item.entity, resolvedIds);
            if (resolvedKey) {
              await deleteEntity(item.entity, resolvedKey);
            }
            if (item.entityKey && item.entityKey !== resolvedKey) {
              await deleteEntity(item.entity, item.entityKey);
            }
          }

          await deleteOfflineQueueItem(item.id);
          progressed = true;
          didSync = true;
        } catch (err) {
          if (typeof navigator !== "undefined" && !navigator.onLine) {
            nextPending.push(item);
            continue;
          }

          if (
            (isUnauthorized(err) || isForbidden(err)) &&
            err?.config?.__isRetryRequest
          ) {
            await deleteOfflineQueueItem(item.id);
            progressed = true;
            continue;
          }

          if (
            isConflict(err) &&
            item.method === "POST" &&
            (item.entity === "userProjects" || item.entity === "userTasks")
          ) {
            await deleteOfflineQueueItem(item.id);
            progressed = true;
            didSync = true;
            continue;
          }

          nextPending.push(item);
        }
      }

      pending = nextPending;
    }

    if (didSync) {
      await refreshAll(store);
    }
  } finally {
    syncInProgress = false;
  }
};

export const setupOfflineSync = (store) => {
  if (typeof window === "undefined") return;
  let hadAuth = false;
  const runIfAuthed = () => syncOfflineQueue(store);
  window.addEventListener("online", runIfAuthed);
  const unsubscribe = store.subscribe(() => {
    const authed = isAuthenticated(store);
    if (authed && !hadAuth && navigator.onLine) {
      runIfAuthed();
    }
    hadAuth = authed;
  });
  if (navigator.onLine) runIfAuthed();
  return () => {
    window.removeEventListener("online", runIfAuthed);
    unsubscribe();
  };
};
