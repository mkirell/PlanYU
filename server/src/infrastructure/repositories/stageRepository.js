import { Stage } from "../models/index.js";
import { NotFoundError } from "../../shared/errors/appError.js";

const StageRepository = {
  async findAll({ project_id } = {}) {
    const where = {};
    if (project_id !== undefined) where.project_id = project_id;
    return Stage.findAll({ where, order: [["sort_order", "ASC"]] });
  },

  async findById(id) {
    const stage = await Stage.findByPk(id);
    if (!stage) throw new NotFoundError("Stage not found");
    return stage;
  },

  async findFirstByProject(project_id) {
    return Stage.findOne({
      where: { project_id },
      order: [["sort_order", "ASC"]],
    });
  },

  async findMaxOrderByProject(project_id) {
    const latest = await Stage.findOne({
      where: { project_id },
      order: [["sort_order", "DESC"]],
    });
    return latest?.sort_order ?? 0;
  },

  async create(data) {
    return Stage.create(data);
  },

  async update(id, data) {
    const stage = await Stage.findByPk(id);
    if (!stage) throw new NotFoundError("Stage not found");
    await stage.update(data);
    return stage;
  },

  async incrementSortOrders(project_id, startOrder, endOrder, excludeId) {
    if (startOrder > endOrder) return 0;
    const stages = await Stage.findAll({
      where: { project_id },
      order: [["sort_order", "DESC"]],
    });
    const targets = stages.filter(
      (item) =>
        item.stage_id !== excludeId &&
        item.sort_order >= startOrder &&
        item.sort_order <= endOrder,
    );
    for (const stage of targets) {
      await stage.update({ sort_order: stage.sort_order + 1 });
    }
    return targets.length;
  },

  async decrementSortOrders(project_id, startOrder, endOrder, excludeId) {
    if (startOrder > endOrder) return 0;
    const stages = await Stage.findAll({
      where: { project_id },
      order: [["sort_order", "ASC"]],
    });
    const targets = stages.filter(
      (item) =>
        item.stage_id !== excludeId &&
        item.sort_order >= startOrder &&
        item.sort_order <= endOrder,
    );
    for (const stage of targets) {
      await stage.update({ sort_order: stage.sort_order - 1 });
    }
    return targets.length;
  },

  async delete(id) {
    const stage = await Stage.findByPk(id);
    if (!stage) throw new NotFoundError("Stage not found");
    const deleted = stage.toJSON();
    await stage.destroy();
    return deleted;
  },
};

export default StageRepository;
