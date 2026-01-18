import React, { useState, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import routes from "./pages/routes.js";
import "./assets/styles/main.css";

export default function App() {
  const storedUserId = Number(localStorage.getItem("currentUserId"));
  const [currentUserId, setCurrentUserId] = useState(storedUserId || null);

  const handleLogin = (userId) => {
    localStorage.setItem("currentUserId", String(userId));
    setCurrentUserId(userId);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUserId");
    setCurrentUserId(null);
  };

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {routes.map((r) => {
            const Component = React.lazy(r.component);

            let element = null;
            if (r.name === "Auth") {
              element = currentUserId ? (
                <Navigate to="/board" replace />
              ) : (
                <Component onLogin={handleLogin} />
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
