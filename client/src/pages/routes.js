export const routes = [
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

export default routes;
