import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import usersReducer from "./users/userSlice";
import profilesReducer from "./profiles/profileSlice";
import projectsReducer from "./projects/projectSlice";
import tasksReducer from "./tasks/taskSlice";
import userProjectsReducer from "./userProjects/userProjectSlice";
import usertasksReducer  from "./userTasks/userTaskSlice"; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    profiles: profilesReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    userProjects: userProjectsReducer,
    usertasks: usertasksReducer,
  },
});
