import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/usersSlice";
import profilesReducer from "./slices/profilesSlice";
import projectsReducer from "./slices/projectsSlice";
import tasksReducer from "./slices/tasksSlice";
import userProjectsReducer from "./slices/userProjectsSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    profiles: profilesReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    userProjects: userProjectsReducer,
  },
});
