export const OpenRoutes = [
  {
    path: "/board",
    name: "Board",
    component: () => import("./Board/Board.jsx"),
  },
  {
    path: "/auth",
    name: "Auth",
    component: () => import("./Auth/Auth.jsx"),
  },
];
