import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import usersReducer from "./slices/userSlice";
import profilesReducer from "./slices/profileSlice";
import projectsReducer from "./slices/projectSlice";
import tasksReducer from "./slices/taskSlice";
import userProjectsReducer from "./slices/userProjectSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    profiles: profilesReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    userProjects: userProjectsReducer,
  },
});
