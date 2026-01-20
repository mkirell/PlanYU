export const GuestRoutes = [
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
