import { UnauthorizedError } from "../../shared/utils/errorHandler.js";
import UserProjectRepository from "../../infrastructure/repositories/userProjectRepository.js";
import TaskRepository from "../../infrastructure/repositories/taskRepository.js";
import ProfileRepository from "../../infrastructure/repositories/profileRepository.js";

export default function authorize(...allowedRoles) {
  return async function (req, res, next) {
    const user = req.user || {};
    if (!allowedRoles || allowedRoles.length === 0) {
      return next();
    }

    if (allowedRoles.includes("SELF")) {
      const userParam =
        (req.params &&
          (req.params.user_id || req.params.userId || req.params.id)) ||
        (req.body && (req.body.user_id || req.body.userId)) ||
        (req.query && (req.query.user_id || req.query.userId));

      if (userParam && String(userParam) === String(user.user_id))
        return next();

      const profileParam =
        (req.params && (req.params.profile_id || req.params.id)) ||
        (req.body && (req.body.profile_id || req.body.id)) ||
        (req.query && (req.query.profile_id || req.query.id));
      if (profileParam) {
        try {
          const profile = await ProfileRepository.findById(profileParam);
          if (profile && String(profile.user_id) === String(user.user_id))
            return next();
        } catch (e) {}
      }

      if (allowedRoles.length === 1)
        return next(new UnauthorizedError("Action not allowed"));
    }

    const projectRoles = ["OWNER", "MEMBER"];

    if (allowedRoles.some((r) => projectRoles.includes(r))) {
      const candidateId =
        (req.params &&
          (req.params.project_id || req.params.task_id || req.params.id)) ||
        (req.body && (req.body.project_id || req.body.task_id)) ||
        (req.query && (req.query.project_id || req.query.task_id));

      let projectId = candidateId;
      const baseUrl = typeof req.baseUrl === "string" ? req.baseUrl : "";
      const isProjectScoped =
        baseUrl.includes("/projects") || baseUrl.includes("/user-projects");
      const isTaskCreate = baseUrl.includes("/tasks") && req.method === "POST";
      const bodyHasProjectId = Boolean(req.body && req.body.project_id);
      const bodyHasTaskId = Boolean(req.body && req.body.task_id);

      if (!isProjectScoped && !isTaskCreate && !(bodyHasProjectId && !bodyHasTaskId)) {
        try {
          const task = await TaskRepository.findById(candidateId);
          if (task && task.project_id) projectId = task.project_id;
        } catch (e) {}
      }

      try {
        const up = await UserProjectRepository.findByIds(
          user.user_id,
          projectId,
        );
        if (!up || !allowedRoles.includes(up.role))
          return next(new UnauthorizedError("Insufficient permissions"));
        return next();
      } catch (err) {
        return next(new UnauthorizedError("Insufficient permissions"));
      }
    }

    if (!user.role || !allowedRoles.includes(user.role))
      return next(new UnauthorizedError("Insufficient permissions"));
    return next();
  };
}
