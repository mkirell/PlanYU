import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import axios from "axios";
import { store } from "./features/store";
import App from "./App";
import { refreshUser } from "./features/auth/authThunks";
import { setupOfflineSync } from "./shared/network/syncService";
import { loadAuthCache } from "./shared/cache/offlineApi";
import { setupAuthInterceptor } from "./shared/network/authInterceptor";

axios.defaults.withCredentials = true;
axios.defaults.timeout = 4000;

const startApp = () => {
  setupAuthInterceptor(store);
  setupOfflineSync(store);
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  );
};

if (typeof navigator !== "undefined" && !navigator.onLine) {
  store
    .dispatch(refreshUser())
    .catch(() => {})
    .finally(() => {
      startApp();
    });
} else {
  loadAuthCache()
    .then((cached) => {
      if (cached?.user || cached?.accessToken) {
        return store.dispatch(refreshUser());
      }
      return null;
    })
    .catch(() => {})
    .finally(() => {
      startApp();
    });
}
