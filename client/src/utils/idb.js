const DB_NAME = "playu-offline-db";
const DB_VERSION = 1;
const AUTH_STORE = "auth";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (ev) => {
      const db = ev.target.result;
      if (!db.objectStoreNames.contains(AUTH_STORE)) {
        db.createObjectStore(AUTH_STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

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
