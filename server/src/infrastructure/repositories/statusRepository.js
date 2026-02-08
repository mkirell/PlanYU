import { Status } from "../models/index.js";
import { NotFoundError } from "../../shared/utils/errorHandler.js";

const StatusRepository = {
  async findAll({ project_id } = {}) {
    const where = {};
    if (project_id !== undefined) where.project_id = project_id;
    return Status.findAll({ where, order: [["sort_order", "ASC"]] });
  },

  async findById(id) {
    const status = await Status.findByPk(id);
    if (!status) throw new NotFoundError("Status not found");
    return status;
  },

  async findDefaultByProjectAndType(project_id, type) {
    return Status.findOne({
      where: { project_id, type },
      order: [["sort_order", "ASC"]],
    });
  },

  async findMaxOrderByProject(project_id) {
    const latest = await Status.findOne({
      where: { project_id },
      order: [["sort_order", "DESC"]],
    });
    return latest?.sort_order ?? 0;
  },

  async create(data) {
    return Status.create(data);
  },

  async update(id, data) {
    const status = await Status.findByPk(id);
    if (!status) throw new NotFoundError("Status not found");
    await status.update(data);
    return status;
  },

  async incrementSortOrders(project_id, startOrder, endOrder, excludeId) {
    if (startOrder > endOrder) return 0;
    const statuses = await Status.findAll({
      where: { project_id },
      order: [["sort_order", "DESC"]],
    });
    const targets = statuses.filter(
      (item) =>
        item.status_id !== excludeId &&
        item.sort_order >= startOrder &&
        item.sort_order <= endOrder,
    );
    for (const status of targets) {
      await status.update({ sort_order: status.sort_order + 1 });
    }
    return targets.length;
  },

  async decrementSortOrders(project_id, startOrder, endOrder, excludeId) {
    if (startOrder > endOrder) return 0;
    const statuses = await Status.findAll({
      where: { project_id },
      order: [["sort_order", "ASC"]],
    });
    const targets = statuses.filter(
      (item) =>
        item.status_id !== excludeId &&
        item.sort_order >= startOrder &&
        item.sort_order <= endOrder,
    );
    for (const status of targets) {
      await status.update({ sort_order: status.sort_order - 1 });
    }
    return targets.length;
  },

  async delete(id) {
    const status = await Status.findByPk(id);
    if (!status) throw new NotFoundError("Status not found");
    const deleted = status.toJSON();
    await status.destroy();
    return deleted;
  },
};

export default StatusRepository;
