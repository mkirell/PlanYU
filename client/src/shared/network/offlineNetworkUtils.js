export const isOffline = () =>
  typeof navigator !== "undefined" && !navigator.onLine;

export const isNetworkError = (err) => {
  if (!err?.response) return true;
  const status = err.response?.status;
  const statusText = err.response?.statusText;
  return status === 503 && statusText === "Offline";
};
