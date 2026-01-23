import {
  setEntityList,
  getEntityList,
  getEntityById,
  upsertEntity,
  deleteEntity,
  enqueueOfflineRequest as enqueueIdbRequest,
} from "./idbService";

export const LOCAL_ID_PREFIX = "local-";

export const createLocalId = () =>
  `${LOCAL_ID_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const makeCompositeKey = (parts) => parts.join(":");

// Read helpers
export const readListFromCache = async (storeName) => {
  const items = await getEntityList(storeName);
  return items || [];
};

export const readItemFromCache = async (storeName, id) => {
  return getEntityById(storeName, id);
};

// Write helpers
export const saveListToCache = async (storeName, items, getKey) => {
  await setEntityList(storeName, items, getKey);
  return items;
};

export const saveItemToCache = async (storeName, id, item) => {
  await upsertEntity(storeName, id, item);
  return item;
};

export const deleteFromCache = async (storeName, id) => {
  await deleteEntity(storeName, id);
};

export const enqueueOfflineRequest = async (payload) => {
  await enqueueIdbRequest(payload);
};
