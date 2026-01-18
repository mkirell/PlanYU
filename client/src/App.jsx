import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import routes from "./pages/routes.js";
import "./assets/styles/main.css";
import Notif from "./components/Notif/Notif.jsx";
import { logoutUser } from "./features/auth/authThunks";

export default function App() {
  const dispatch = useDispatch();
  const currentUserId = useSelector((s) => s.auth.data?.user?.user_id ?? null);

  const handleLogout = async () => {
    dispatch(logoutUser());
  };

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Notif />
        <Routes>
          {routes.map((r) => {
            const Component = React.lazy(r.component);

            let element = null;
            if (r.name === "Auth") {
              element = currentUserId ? (
                <Navigate to="/board" replace />
              ) : (
                <Component />
              );
            } else {
              element = currentUserId ? (
                <Component
                  currentUserId={currentUserId}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/auth" replace />
              );
            }

            return <Route key={r.name} path={r.path} element={element} />;
          })}

          <Route
            path="*"
            element={
              currentUserId ? (
                <Navigate to="/board" replace />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
