import axios from "axios";
import {
  createLocalId,
  makeCompositeKey,
  saveListToCache,
  saveItemToCache,
  deleteFromCache,
  readListFromCache,
  readItemFromCache,
  enqueueOfflineRequest,
} from "./offlineStoreHelpers";
import {
  setOfflineAuth,
  getOfflineAuth,
  clearOfflineAuth,
} from "./offlineDbService";

// Cache read helpers
export const listFromCache = async (store) => readListFromCache(store);

export const getFromCache = async (store, id) => readItemFromCache(store, id);

// Cache write helpers
export const cacheOnlineList = async ({ store, items, getKey }) => {
  await saveListToCache(store, items, getKey);
  return items;
};

export const cacheOnlineItem = async ({ store, id, item }) => {
  await saveItemToCache(store, id, item);
  return item;
};

export const deleteCachedItem = async ({ store, id }) => {
  await deleteFromCache(store, id);
  return id;
};

// Auth cache helpers
export const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const saveAuthCache = async (data) => {
  if (!data?.user) return;
  await setOfflineAuth({
    accessToken: data?.accessToken || null,
    user: data.user,
    savedAt: Date.now(),
  });
};

export const clearAuthCache = async () => {
  await clearOfflineAuth();
};

export const loadAuthCache = async () => {
  const cached = await getOfflineAuth();
  if (cached?.accessToken) {
    setAuthHeader(cached.accessToken);
  }
  if (cached?.user) {
    return {
      accessToken: cached.accessToken || null,
      user: cached.user,
      offline: true,
    };
  }
  return null;
};

// Offline entity helpers
export const createOfflineEntity = async ({ store, idField, body, url }) => {
  const localId = createLocalId();
  const item = {
    ...body,
    [idField]: localId,
    __offline: true,
  };
  await saveItemToCache(store, localId, item);
  await enqueueOfflineRequest({
    entity: store,
    method: "POST",
    url,
    body,
    tempId: localId,
    ids: {},
    entityKey: localId,
  });
  return item;
};

export const updateOfflineEntity = async ({
  store,
  idField,
  id,
  patch,
  url,
}) => {
  const existing = await readItemFromCache(store, id);
  const item = {
    ...(existing || {}),
    ...patch,
    [idField]: id,
    __offline: true,
  };
  await saveItemToCache(store, id, item);
  await enqueueOfflineRequest({
    entity: store,
    method: "PATCH",
    url,
    body: patch,
    ids: { [idField]: id },
    entityKey: id,
  });
  return item;
};

export const deleteOfflineEntity = async ({ store, id, url, idField }) => {
  await deleteFromCache(store, id);
  await enqueueOfflineRequest({
    entity: store,
    method: "DELETE",
    url,
    ids: { [idField]: id },
    entityKey: id,
  });
  return id;
};

// Offline relation helpers
export const createOfflineRelation = async ({ store, key, body, url, ids }) => {
  const item = { ...body, __offline: true };
  await saveItemToCache(store, key, item);
  await enqueueOfflineRequest({
    entity: store,
    method: "POST",
    url,
    body,
    ids,
    entityKey: key,
  });
  return item;
};

export const updateOfflineRelation = async ({ store, key, body, url, ids }) => {
  const existing = await readItemFromCache(store, key);
  const item = { ...(existing || {}), ...body, __offline: true };
  await saveItemToCache(store, key, item);
  await enqueueOfflineRequest({
    entity: store,
    method: "PATCH",
    url,
    body,
    ids,
    entityKey: key,
  });
  return item;
};

export const deleteOfflineRelation = async ({ store, key, url, ids }) => {
  await deleteFromCache(store, key);
  await enqueueOfflineRequest({
    entity: store,
    method: "DELETE",
    url,
    ids,
    entityKey: key,
  });
  return ids;
};

export const createOfflineProject = async ({ project, ownerUserId }) => {
  const created = await createOfflineEntity({
    store: "projects",
    idField: "project_id",
    body: project,
    url: "/api/projects",
  });

  if (ownerUserId) {
    const key = makeCompositeKey([ownerUserId, created.project_id]);
    await saveItemToCache("userProjects", key, {
      user_id: ownerUserId,
      project_id: created.project_id,
      role: "OWNER",
      __offline: true,
    });
  }

  return created;
};
