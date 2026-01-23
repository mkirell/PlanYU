const DB_NAME = "playu-offline-db";
const DB_VERSION = 1;
const AUTH_STORE = "auth";
const QUEUE_STORE = "offline-queue";
const ID_MAP_STORE = "id-map";
const ENTITY_STORES = [
  "projects",
  "tasks",
  "profiles",
  "users",
  "userProjects",
  "userTasks",
];

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (ev) => {
      const db = ev.target.result;
      if (!db.objectStoreNames.contains(AUTH_STORE)) {
        db.createObjectStore(AUTH_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(QUEUE_STORE)) {
        db.createObjectStore(QUEUE_STORE, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains(ID_MAP_STORE)) {
        db.createObjectStore(ID_MAP_STORE, { keyPath: "key" });
      }
      ENTITY_STORES.forEach((name) => {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: "id" });
        }
      });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Auth

export async function setOfflineAuth(obj) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(AUTH_STORE, "readwrite");
    const store = tx.objectStore(AUTH_STORE);
    store.put({ id: "offline", ...obj });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getOfflineAuth() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(AUTH_STORE, "readonly");
    const store = tx.objectStore(AUTH_STORE);
    const r = store.get("offline");
    r.onsuccess = () => resolve(r.result || null);
    r.onerror = () => reject(r.error);
  });
}

export async function clearOfflineAuth() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(AUTH_STORE, "readwrite");
    const store = tx.objectStore(AUTH_STORE);
    store.delete("offline");
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

// Entity cache

export async function setEntityList(storeName, items, getKey) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.clear();
    items.forEach((item) => {
      const id = getKey(item);
      store.put({ id, value: item });
    });
    tx.oncomplete = () => resolve(items);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getEntityList(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const r = store.getAll();
    r.onsuccess = () => resolve(r.result.map((row) => row.value));
    r.onerror = () => reject(r.error);
  });
}

export async function getEntityById(storeName, id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const r = store.get(id);
    r.onsuccess = () => resolve(r.result?.value || null);
    r.onerror = () => reject(r.error);
  });
}

export async function upsertEntity(storeName, id, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.put({ id, value });
    tx.oncomplete = () => resolve(value);
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteEntity(storeName, id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.delete(id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

// Queue

export async function enqueueOfflineRequest(payload) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE, "readwrite");
    const store = tx.objectStore(QUEUE_STORE);
    store.add({ ...payload, createdAt: Date.now() });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getOfflineQueue() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE, "readonly");
    const store = tx.objectStore(QUEUE_STORE);
    const r = store.getAll();
    r.onsuccess = () => resolve(r.result || []);
    r.onerror = () => reject(r.error);
  });
}

export async function deleteOfflineQueueItem(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE, "readwrite");
    const store = tx.objectStore(QUEUE_STORE);
    store.delete(id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

// ID mapping

export async function setIdMapping(entity, tempId, realId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ID_MAP_STORE, "readwrite");
    const store = tx.objectStore(ID_MAP_STORE);
    store.put({ key: `${entity}:${tempId}`, realId });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getIdMapping(entity, tempId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ID_MAP_STORE, "readonly");
    const store = tx.objectStore(ID_MAP_STORE);
    const r = store.get(`${entity}:${tempId}`);
    r.onsuccess = () => resolve(r.result?.realId || null);
    r.onerror = () => reject(r.error);
  });
}
