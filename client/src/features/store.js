import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import usersReducer from "./users/userSlice";
import profilesReducer from "./profiles/profileSlice";
import projectsReducer from "./projects/projectSlice";
import tasksReducer from "./tasks/taskSlice";
import stagesReducer from "./stages/stageSlice";
import userProjectsReducer from "./userProjects/userProjectSlice";
import userTasksReducer from "./userTasks/userTaskSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    profiles: profilesReducer,
    projects: projectsReducer,
    stages: stagesReducer,
    tasks: tasksReducer,
    userProjects: userProjectsReducer,
    userTasks: userTasksReducer,
  },
});
