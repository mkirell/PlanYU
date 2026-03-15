import TaskRepository from "../../infrastructure/repositories/taskRepository.js";
import UserTaskRepository from "../../infrastructure/repositories/userTaskRepository.js";
import ProjectRepository from "../../infrastructure/repositories/projectRepository.js";
import UserProjectRepository from "../../infrastructure/repositories/userProjectRepository.js";
import StageRepository from "../../infrastructure/repositories/stageRepository.js";
import StageService from "./stageService.js";
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

    if (!entity.stage_id) {
      let defaultStage = await StageRepository.findFirstByProject(
        entity.project_id,
      );
      if (!defaultStage) {
        await StageService.createDefaultStages(entity.project_id);
        defaultStage = await StageRepository.findFirstByProject(
          entity.project_id,
        );
      }
      if (!defaultStage) throw new ValidationError("No stage available for task");
      entity.stage_id = defaultStage.stage_id;
    } else {
      const stage = await StageRepository.findById(entity.stage_id);
      if (stage.project_id !== entity.project_id)
        throw new ValidationError("Stage does not match project");
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

    if (entity.stage_id !== undefined) {
      if (!taskRecord) {
        taskRecord = await TaskRepository.findById(id).catch(() => null);
      }
      const stage = await StageRepository.findById(entity.stage_id);
      if (!stage) throw new ValidationError("Stage not found");
      const currentStatus = await StageRepository.findById(
        taskRecord?.stage_id,
      );
      if (
        taskRecord?.stage_id === entity.stage_id ||
        currentStatus?.status === stage.status
      ) {
        return TaskRepository.update(id, entity.toUpdateObject());
      }
      const targetProjectId = entity.project_id ?? taskRecord?.project_id;
      if (targetProjectId && stage.project_id !== targetProjectId) {
        throw new ValidationError("Stage does not match project");
      }
      if (effectiveRole) {
        if (effectiveRole === "ASSIGNEE") {
          const nextByStatus = {
            TODO: "DOING",
            DOING: "REVIEW",
          };
          const expectedNext = nextByStatus[currentStatus?.status];
          if (!expectedNext || stage.status !== expectedNext)
            throw new UnauthorizedError("Action not allowed");
        } else if (effectiveRole === "REVIEWER") {
          const currentStatus = await StageRepository.findById(
            taskRecord?.stage_id,
          );
          const isReviewStage = currentStatus?.status === "REVIEW";
          const isAllowedTarget = ["DONE", "DOING"].includes(stage.status);
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
