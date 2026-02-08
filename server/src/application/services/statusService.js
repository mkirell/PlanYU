import StatusRepository from "../../infrastructure/repositories/statusRepository.js";
import ProjectRepository from "../../infrastructure/repositories/projectRepository.js";
import TaskRepository from "../../infrastructure/repositories/taskRepository.js";
import StatusEntity from "../../domain/entities/statusEntity.js";
import {
  createStatusSchema,
  updateStatusSchema,
} from "../validators/statusValidator.js";
import { ValidationError } from "../../shared/utils/errorHandler.js";

const DEFAULT_STATUSES = [
  {
    name: "To Do",
    description:
      "Planned tasks that are queued and waiting to be picked up by the team.",
    type: "TODO",
    icon: "📝",
    color: "#d04545",
    sort_order: 1,
  },
  {
    name: "In Progress",
    description:
      "Tasks that are actively being worked on and moving toward completion.",
    type: "DOING",
    icon: "⚙️",
    color: "#b06b00",
    sort_order: 2,
  },
  {
    name: "Review",
    description:
      "Items awaiting review, testing, or feedback before they can be finalized.",
    type: "REVIEW",
    icon: "🔍",
    color: "#6f42c1",
    sort_order: 3,
  },
  {
    name: "Done",
    description:
      "Work that has been completed, verified, and is ready for delivery or closure.",
    type: "DONE",
    icon: "✅",
    color: "#1b8a3e",
    sort_order: 4,
  },
];

const StatusService = {
  async list({ project_id } = {}) {
    return StatusRepository.findAll({ project_id });
  },

  async get(id) {
    return StatusRepository.findById(id);
  },

  async create(payload) {
    const parsed = createStatusSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid status data", parsed.error.errors);
    const entity = new StatusEntity(parsed.data);
    await ProjectRepository.findById(entity.project_id);

    const maxOrder = await StatusRepository.findMaxOrderByProject(
      entity.project_id,
    );
    if (entity.sort_order === undefined || entity.sort_order === null) {
      entity.sort_order = maxOrder + 1;
    } else {
      const targetOrder = Math.max(
        1,
        Math.min(entity.sort_order, maxOrder + 1),
      );
      entity.sort_order = targetOrder;
      await StatusRepository.incrementSortOrders(
        entity.project_id,
        targetOrder,
        maxOrder,
        null,
      );
    }
    return StatusRepository.create(entity.toCreateObject());
  },

  async createDefaultStatuses(project_id) {
    await ProjectRepository.findById(project_id);
    const existing = await StatusRepository.findAll({ project_id });
    if (existing.length > 0) return existing;

    const created = [];
    for (const status of DEFAULT_STATUSES) {
      created.push(
        await StatusRepository.create({
          project_id,
          name: status.name,
          description: status.description,
          type: status.type,
          icon: status.icon,
          color: status.color,
          sort_order: status.sort_order,
        }),
      );
    }
    return created;
  },

  async update(id, payload) {
    const parsed = updateStatusSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid status data", parsed.error.errors);
    const existing = await StatusRepository.findById(id);
    const entity = new StatusEntity(parsed.data);
    const updateData = entity.toUpdateObject();

    if (entity.sort_order !== undefined) {
      const maxOrder = await StatusRepository.findMaxOrderByProject(
        existing.project_id,
      );
      const newOrder = Math.max(1, Math.min(entity.sort_order, maxOrder));
      const currentOrder = existing.sort_order;

      updateData.sort_order = newOrder;

      if (newOrder > currentOrder) {
        await StatusRepository.decrementSortOrders(
          existing.project_id,
          currentOrder + 1,
          newOrder,
          existing.status_id,
        );
      } else if (newOrder < currentOrder) {
        await StatusRepository.incrementSortOrders(
          existing.project_id,
          newOrder,
          currentOrder - 1,
          existing.status_id,
        );
      }
    }

    return StatusRepository.update(id, updateData);
  },

  async delete(id) {
    const existing = await StatusRepository.findById(id);
    const tasks = await TaskRepository.findByStatusId(id);
    if (tasks.length > 0)
      throw new ValidationError("Status has tasks assigned");
    return StatusRepository.delete(existing.status_id);
  },
};

export { DEFAULT_STATUSES };
export default StatusService;
