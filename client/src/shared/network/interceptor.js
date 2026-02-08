import axios from "axios";
import { refreshUser, logoutUser } from "../../features/auth/authThunks";

const isRefreshEndpoint = (config) =>
  typeof config?.url === "string" && config.url.includes("/api/auth/refresh");

const isAuthEndpoint = (config) =>
  typeof config?.url === "string" &&
  ["/api/auth/login", "/api/auth/register", "/api/auth/logout"].some((path) =>
    config.url.includes(path),
  );

export const setupAuthInterceptor = (store) => {
  if (!store?.dispatch) return () => {};

  let refreshPromise = null;

  const requestInterceptorId = axios.interceptors.request.use((config) => {
    const token = store.getState?.()?.auth?.data?.accessToken;
    if (token && !config?.headers?.Authorization) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  });

  const onResponseError = async (error) => {
    const { config, response } = error || {};
    if (!config || response?.status !== 401) {
      return Promise.reject(error);
    }

    if (config.__isRetryRequest) {
      return Promise.reject(error);
    }

    if (isRefreshEndpoint(config)) {
      try {
        await store.dispatch(logoutUser());
      } catch {
        // ignore logout errors
      }
      return Promise.reject(error);
    }

    if (isAuthEndpoint(config)) {
      return Promise.reject(error);
    }

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return Promise.reject(error);
    }

    try {
      if (!refreshPromise) {
        refreshPromise = store.dispatch(refreshUser());
      }
      const refreshAction = await refreshPromise;
      refreshPromise = null;

      if (!refreshUser.fulfilled.match(refreshAction)) {
        await store.dispatch(logoutUser());
        return Promise.reject(error);
      }

      config.__isRetryRequest = true;
      return axios(config);
    } catch (refreshErr) {
      refreshPromise = null;
      try {
        await store.dispatch(logoutUser());
      } catch {
        // ignore logout errors
      }
      return Promise.reject(refreshErr);
    }
  };

  const interceptorId = axios.interceptors.response.use(
    (response) => response,
    onResponseError,
  );

  return () => {
    axios.interceptors.request.eject(requestInterceptorId);
    axios.interceptors.response.eject(interceptorId);
  };
};
