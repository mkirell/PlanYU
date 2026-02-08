import TaskRepository from "../../infrastructure/repositories/taskRepository.js";
import UserTaskRepository from "../../infrastructure/repositories/userTaskRepository.js";
import ProjectRepository from "../../infrastructure/repositories/projectRepository.js";
import UserProjectRepository from "../../infrastructure/repositories/userProjectRepository.js";
import StatusRepository from "../../infrastructure/repositories/statusRepository.js";
import StatusService from "./statusService.js";
import TaskEntity from "../../domain/entities/taskEntity.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/taskValidator.js";
import {
  ValidationError,
  UnauthorizedError,
} from "../../shared/utils/errorHandler.js";

const TaskService = {
  async list() {
    return TaskRepository.findAll();
  },

  async get(id) {
    return TaskRepository.findById(id);
  },

  async create(payload) {
    const parsed = createTaskSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid task data", parsed.error.errors);
    const entity = new TaskEntity(parsed.data);
    await ProjectRepository.findById(entity.project_id);

    if (!entity.status_id) {
      let defaultStatus = await StatusRepository.findDefaultByProjectAndType(
        entity.project_id,
        "TODO",
      );
      if (!defaultStatus) {
        await StatusService.createDefaultStatuses(entity.project_id);
        defaultStatus = await StatusRepository.findDefaultByProjectAndType(
          entity.project_id,
          "TODO",
        );
      }
      if (!defaultStatus) throw new ValidationError("Default status not found");
      entity.status_id = defaultStatus.status_id;
    } else {
      const status = await StatusRepository.findById(entity.status_id);
      if (status.project_id !== entity.project_id)
        throw new ValidationError("Status does not match project");
    }

    return TaskRepository.create(entity.toCreateObject());
  },

  async update(id, payload, user) {
    const parsed = updateTaskSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid task data", parsed.error.errors);
    const entity = new TaskEntity(parsed.data);

    const ut = await UserTaskRepository.findByIds(user.user_id, id).catch(
      () => null,
    );

    let effectiveRole = null;
    let taskRecord = null;
    if (ut) {
      effectiveRole = ut.role;
    } else {
      taskRecord = await TaskRepository.findById(id).catch(() => null);
      if (taskRecord && taskRecord.project_id) {
        const up = await UserProjectRepository.findByIds(
          user.user_id,
          taskRecord.project_id,
        ).catch(() => null);
        if (up) effectiveRole = up.role;
      }
    }

    if (entity.status_id !== undefined) {
      if (!taskRecord) {
        taskRecord = await TaskRepository.findById(id).catch(() => null);
      }
      const status = await StatusRepository.findById(entity.status_id);
      if (!status) throw new ValidationError("Status not found");
      const currentStatus = await StatusRepository.findById(
        taskRecord?.status_id,
      );
      if (
        taskRecord?.status_id === entity.status_id ||
        currentStatus?.type === status.type
      ) {
        return TaskRepository.update(id, entity.toUpdateObject());
      }
      const targetProjectId = entity.project_id ?? taskRecord?.project_id;
      if (targetProjectId && status.project_id !== targetProjectId) {
        throw new ValidationError("Status does not match project");
      }
      if (effectiveRole) {
        if (effectiveRole === "ASSIGNEE") {
          const nextByType = {
            TODO: "DOING",
            DOING: "REVIEW",
          };
          const expectedNext = nextByType[currentStatus?.type];
          if (!expectedNext || status.type !== expectedNext)
            throw new UnauthorizedError("Action not allowed");
        } else if (effectiveRole === "REVIEWER") {
          const currentStatus = await StatusRepository.findById(
            taskRecord?.status_id,
          );
          const isReviewStage = currentStatus?.type === "REVIEW";
          const isAllowedTarget = ["DONE", "DOING"].includes(status.type);
          if (!isReviewStage || !isAllowedTarget)
            throw new UnauthorizedError("Action not allowed");
        } else if (!["REVIEWER", "OWNER"].includes(effectiveRole)) {
          throw new UnauthorizedError("Insufficient permissions");
        }
      }
    } else if (
      effectiveRole &&
      !["REVIEWER", "OWNER", "ASSIGNEE"].includes(effectiveRole)
    ) {
      throw new UnauthorizedError("Insufficient permissions");
    }

    return TaskRepository.update(id, entity.toUpdateObject());
  },

  async delete(id) {
    return TaskRepository.delete(id);
  },
};

export default TaskService;
