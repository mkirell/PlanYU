import StageRepository from "../../infrastructure/repositories/stageRepository.js";
import ProjectRepository from "../../infrastructure/repositories/projectRepository.js";
import TaskRepository from "../../infrastructure/repositories/taskRepository.js";
import StageEntity from "../../domain/entities/stageEntity.js";
import {
  createStageSchema,
  updateStageSchema,
} from "../validators/stageValidator.js";
import { ValidationError } from "../../shared/utils/errorHandler.js";

const STATUS_RANK = {
  TODO: 1,
  DOING: 2,
  REVIEW: 3,
  DONE: 4,
};

const DEFAULT_STAGES = [
  {
    name: "To Do",
    description:
      "Planned tasks that are queued and waiting to be picked up by the team.",
    status: "TODO",
    icon: "📝",
    color: "#d04545",
    sort_order: 1,
  },
  {
    name: "In Progress",
    description:
      "Tasks that are actively being worked on and moving toward completion.",
    status: "DOING",
    icon: "⚙️",
    color: "#b06b00",
    sort_order: 2,
  },
  {
    name: "Review",
    description:
      "Items awaiting review, testing, or feedback before they can be finalized.",
    status: "REVIEW",
    icon: "🔍",
    color: "#6f42c1",
    sort_order: 3,
  },
  {
    name: "Done",
    description:
      "Work that has been completed, verified, and is ready for delivery or closure.",
    status: "DONE",
    icon: "✅",
    color: "#1b8a3e",
    sort_order: 4,
  },
];

const isMonotonicStatusOrder = (stages) => {
  let previousRank = 0;
  for (const stage of stages) {
    const currentRank = STATUS_RANK[stage.status] ?? 0;
    if (currentRank < previousRank) return false;
    previousRank = currentRank;
  }
  return true;
};

const insertAtOrder = (list, item, sortOrder) => {
  const targetIndex = Math.max(0, Math.min((sortOrder ?? list.length + 1) - 1, list.length));
  const next = [...list];
  next.splice(targetIndex, 0, item);
  return next;
};

const removeById = (list, id) => list.filter((stage) => stage.stage_id !== id);

const StageService = {
  async list({ project_id } = {}) {
    return StageRepository.findAll({ project_id });
  },

  async get(id) {
    return StageRepository.findById(id);
  },

  async create(payload) {
    const parsed = createStageSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid stage data", parsed.error.errors);
    const entity = new StageEntity(parsed.data);
    await ProjectRepository.findById(entity.project_id);

    const maxOrder = await StageRepository.findMaxOrderByProject(
      entity.project_id,
    );
    const stages = await StageRepository.findAll({ project_id: entity.project_id });

    if (entity.sort_order === undefined || entity.sort_order === null) {
      entity.sort_order = maxOrder + 1;
    } else {
      const targetOrder = Math.max(
        1,
        Math.min(entity.sort_order, maxOrder + 1),
      );
      entity.sort_order = targetOrder;
    }

    const projected = insertAtOrder(
      stages,
      {
        status: entity.status,
      },
      entity.sort_order,
    );

    if (!isMonotonicStatusOrder(projected)) {
      throw new ValidationError(
        "Invalid stage order: statuses must stay TODO -> DOING -> REVIEW -> DONE",
      );
    }

    if (entity.sort_order <= maxOrder) {
      await StageRepository.incrementSortOrders(
        entity.project_id,
        entity.sort_order,
        maxOrder,
        null,
      );
    }

    return StageRepository.create(entity.toCreateObject());
  },

  async createDefaultStages(project_id) {
    await ProjectRepository.findById(project_id);
    const existing = await StageRepository.findAll({ project_id });
    if (existing.length > 0) return existing;

    const created = [];
    for (const stage of DEFAULT_STAGES) {
      created.push(
        await StageRepository.create({
          project_id,
          name: stage.name,
          description: stage.description,
          status: stage.status,
          icon: stage.icon,
          color: stage.color,
          sort_order: stage.sort_order,
        }),
      );
    }
    return created;
  },

  async update(id, payload) {
    const parsed = updateStageSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid stage data", parsed.error.errors);
    const existing = await StageRepository.findById(id);
    const entity = new StageEntity(parsed.data);
    const updateData = entity.toUpdateObject();

    const stages = await StageRepository.findAll({ project_id: existing.project_id });
    const stagesWithoutCurrent = removeById(stages, existing.stage_id);

    const maxOrderWithoutCurrent = stagesWithoutCurrent.length;
    const nextOrder =
      entity.sort_order !== undefined
        ? Math.max(1, Math.min(entity.sort_order, Math.max(1, maxOrderWithoutCurrent + 1)))
        : existing.sort_order;

    const projected = insertAtOrder(
      stagesWithoutCurrent,
      {
        stage_id: existing.stage_id,
        status: entity.status ?? existing.status,
      },
      nextOrder,
    );

    if (!isMonotonicStatusOrder(projected)) {
      throw new ValidationError(
        "Invalid stage order: statuses must stay TODO -> DOING -> REVIEW -> DONE",
      );
    }

    if (entity.sort_order !== undefined) {
      const maxOrder = await StageRepository.findMaxOrderByProject(
        existing.project_id,
      );
      const newOrder = Math.max(1, Math.min(entity.sort_order, maxOrder));
      const currentOrder = existing.sort_order;

      updateData.sort_order = newOrder;

      if (newOrder > currentOrder) {
        await StageRepository.decrementSortOrders(
          existing.project_id,
          currentOrder + 1,
          newOrder,
          existing.stage_id,
        );
      } else if (newOrder < currentOrder) {
        await StageRepository.incrementSortOrders(
          existing.project_id,
          newOrder,
          currentOrder - 1,
          existing.stage_id,
        );
      }
    }

    return StageRepository.update(id, updateData);
  },

  async delete(id) {
    const existing = await StageRepository.findById(id);
    const tasks = await TaskRepository.findByStageId(id);
    if (tasks.length > 0)
      throw new ValidationError("Stage has tasks assigned");
    return StageRepository.delete(existing.stage_id);
  },
};

export { DEFAULT_STAGES };
export default StageService;
