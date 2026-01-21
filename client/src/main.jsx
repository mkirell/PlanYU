import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import axios from "axios";
import { store } from "./features/store";
import App from "./App";
import { refreshUser } from "./features/auth/authThunks";

axios.defaults.withCredentials = true;

store
  .dispatch(refreshUser())
  .catch(() => {})
  .finally(() => {
    createRoot(document.getElementById("root")).render(
      <StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </StrictMode>,
    );
  });
