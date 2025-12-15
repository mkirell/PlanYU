import { useState } from "react";
import Board from "./views/Board";
import Auth from "./views/Auth";
import "./App.css";

export default function App() {
  const storedUserId = Number(localStorage.getItem("currentUserId"));
  const [currentUserId, setCurrentUserId] = useState(storedUserId || null);

  const handleLogin = (userId) => {
    setCurrentUserId(userId);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUserId");
    setCurrentUserId(null);
  };

  return currentUserId ? (
    <Board currentUserId={currentUserId} onLogout={handleLogout} />
  ) : (
    <Auth onLogin={handleLogin} />
  );
}
